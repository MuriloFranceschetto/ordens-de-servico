import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { Person } from './person/entities/person.entity';
import { WorkModule } from './work/work.module';
import { Work } from './work/entities/work.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			password: '123456',
			username: 'postgres',
			entities: [Person, Work],
			database: 'trampos',
			synchronize: true,
		}),
		PersonModule,
		WorkModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
