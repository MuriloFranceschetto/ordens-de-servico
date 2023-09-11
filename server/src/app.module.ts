import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { Person } from './person/entities/person.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			password: '123456',
			username: 'postgres',
			entities: [Person],
			database: 'trampos',
			synchronize: true,
		}),
		PersonModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
