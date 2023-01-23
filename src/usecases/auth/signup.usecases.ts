import { IBcryptService } from '@domain/adpaters/bcrypt.interface';
import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { PointLogActionEnum } from '@domain/common/enum/point-log-action.enum';
import { CreatePointModel } from '@domain/model/database/point';
import { CreatePointLogModel } from '@domain/model/database/point-log';
import { CreateRoleModel } from '@domain/model/database/role';
import { CreateUserModel } from '@domain/model/database/user';
import { IPointLogRepository } from '@domain/repositories/point-log.repository.interface';
import { IPointRepository } from '@domain/repositories/point.repository.interface';
import { IRoleRepository } from '@domain/repositories/role.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { SignupDto } from '@infra/controller/auth/dto/signup.dto';
import { EntityManager } from 'typeorm';

export class SignupUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly pointRepository: IPointRepository,
    private readonly pointLogRepository: IPointLogRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly bcryptService: IBcryptService,
    private readonly exceptionService: IException,
  ) {}

  async execute(data: SignupDto, conn: EntityManager) {
    await this.checkEmail(data.email);
    const newUser = new CreateUserModel();

    newUser.name = data.name;
    newUser.email = data.email;
    newUser.password = await this.bcryptService.hash(data.password);
    newUser.zipCode = data.zipCode;
    newUser.address = data.address;

    const user = await this.createUser(newUser, conn);

    const newRoles = data.roles.map((role) => {
      const newRole = new CreateRoleModel();
      newRole.role = role;
      newRole.userId = user.id;

      return newRole;
    });

    await this.createRoles(newRoles, conn);

    await this.giveSignUpBenefit(user.id, conn);
  }

  private async createUser(data: CreateUserModel, conn: EntityManager) {
    try {
      const result = await this.userRepository.create(data, conn);
      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '유저 생성 실패',
      });
    }
  }

  private async createRoles(roles: CreateRoleModel[], conn: EntityManager) {
    const result = await this.roleRepository.insertMany(roles, conn);

    if (!result) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '역할 저장 실패',
      });
    }
  }

  private async checkEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);

    if (user) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: '이메일이 중복됩니다.',
      });
    }
  }

  private async giveSignUpBenefit(userId: number, conn: EntityManager) {
    try {
      const point = await this.createPoint(userId, conn);
      await this.createPointLog(point.id, conn);
    } catch (err) {
      console.log(err);
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '포인트 지급 실패',
      });
    }
  }

  private async createPoint(userId: number, conn: EntityManager) {
    const newPoint = new CreatePointModel();
    newPoint.userId = userId;
    newPoint.point = 100;
    const result = await this.pointRepository.create(newPoint, conn);

    return result;
  }

  private async createPointLog(pointId: number, conn: EntityManager) {
    const newPointLog = new CreatePointLogModel();
    newPointLog.pointId = pointId;
    newPointLog.addPoint = 100;
    newPointLog.usePoint = 0;
    newPointLog.content = '신규 가입 지급 포인트';
    newPointLog.action = PointLogActionEnum.SIGNUP;

    const result = await this.pointLogRepository.create(newPointLog, conn);

    return result;
  }
}
