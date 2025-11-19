import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bullmq';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          host:
            process.env.NODE_ENV === 'test'
              ? configService.getOrThrow('TEST_DB_HOST')
              : configService.getOrThrow<string>('DB_HOST'),
          port:
            process.env.NODE_ENV === 'test'
              ? configService.getOrThrow('TEST_DB_PORT')
              : configService.getOrThrow<number>('DB_PORT'),
          username:
            process.env.NODE_ENV === 'test'
              ? configService.getOrThrow('TEST_DB_USERNAME')
              : configService.getOrThrow<string>('DB_USERNAME'),
          password:
            process.env.NODE_ENV === 'test'
              ? configService.getOrThrow('TEST_DB_PASSWORD')
              : configService.getOrThrow<string>('DB_PASSWORD'),
          database:
            process.env.NODE_ENV === 'test'
              ? configService.getOrThrow('TEST_DB_NAME')
              : configService.getOrThrow<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          logging: configService.get<string>('NODE_ENV') !== 'production',
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<number>('REDIS_PORT'),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: 600,
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class CoreModule {}
