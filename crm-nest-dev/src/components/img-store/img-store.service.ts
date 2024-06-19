import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { of } from 'rxjs';
import { join } from 'path';

@Injectable()
export class ImgStoreService {

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async getImage(file, res, request, path) {
        const cookie = request.cookies[process.env.NEXT_PUBLIC_COOKIE_NAME];
        if (cookie) {
            const decoded: any = this.jwtService.decode(cookie);
            const user = await this.userRepository.findOne({
                where: {
                    email: decoded.email,
                    refresh_token: decoded.refreshToken,
                }
            })
            if (user) {
                return of(
                    res.sendFile(
                        join(process.cwd() + `/${path}/` + file),
                    )
                )
            }
        } else {
            return of(
                res.redirect(process.env.FRONTEND_URL)
            )
        }
    }
}
