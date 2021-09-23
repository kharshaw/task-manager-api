## Deployment

### Heroku
- Create an account on heroku.com.  Verify the email address to complete registration
- Install the Heroku CLI via npm. `sudo npm install heroku -g`
- Using the heroku website create a new application (i.e. task-manager-rkh)
- Login to Heroku via the CLI.  In a terminal do `heroku login`.  It's prompt to hit enter to launch a broswer to complete the login process.
  ``` 
  keith@keith-7590:~$ heroku login
  heroku: Press any key to open up the browser to login or q to exit:
  Opening browser to https://cli-auth.heroku.com/auth/cli/browser/3212d98c-0021-4f98-9c64-f61472dc6d59?requestor=SFMyNTY.g2gDbQAAAA03My4xNzUuNTcuMTIzbgYAcAVK63sBYgABUYA.iQT23QC-wszfeL3jNocJgKzIK2CWNVkKF841j17PDxQ
  Logging in... done
  Logged in as keith.harshaw@gmail.com
  ```
- Create a new, free-tier, pgsql database for the app, 
  ```
  keith@keith-7590:~$ heroku addons:create heroku-postgresql:hobby-dev -a task-app-rkh
  Creating heroku-postgresql:hobby-dev on ⬢ task-app-rkh... free
  Database has been created and is available
  ! This database is empty. If upgrading, you can transfer
  ! data from another database with pg:copy
  Created postgresql-opaque-93072 as DATABASE_URL
  Use heroku addons:docs heroku-postgresql to view documentation
  ```

The database will apear on the heroku dashboard, under Resources. Uoi can view connection information under the database's Settings.

The heroku pipeline integrates with github.  We need to connect our app to our git repo.
```
18:17 $ heroku git:remote -a task-app-rkh
set git remote heroku to https://git.heroku.com/task-app-rkh.git
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
```

Set the configuration in the heroku environment

```
~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
18:18 $ heroku config:set NPM_CONFIG_PRODUCTION=false
Setting NPM_CONFIG_PRODUCTION and restarting ⬢ task-app-rkh... done, v5
NPM_CONFIG_PRODUCTION: false
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
05:50 $ heroku config:set NODE_ENV=production
Setting NODE_ENV and restarting ⬢ task-app-rkh... done, v6
NODE_ENV: production
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
05:50 $ heroku config:set ENVIRONMENT=prod
Setting ENVIRONMENT and restarting ⬢ task-app-rkh... done, v7
ENVIRONMENT: prod
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
05:50 $
```

We also nned to see the database connection values in hte environment

```
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
05:50 $ heroku config:set DB_HOST=[db host from heroku]
Setting DB_HOST and restarting ⬢ task-app-rkh... done, v8
DB_HOST: [db host from heroku]
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
07:05 $ heroku config:set DB_USERNAME=[db username from heroky]
Setting DB_USERNAME and restarting ⬢ task-app-rkh... done, v9
DB_USERNAME: [db usernamefrom heroku]
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
07:05 $ heroku config:set DB_PASSWORD=[db password from heroku]
Setting DB_PASSWORD and restarting ⬢ task-app-rkh... done, v10
DB_PASSWORD: [db password from heroku]
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
07:06 $ heroku config:set DB_DATABASE=[db name from heroku]
Setting DB_DATABASE and restarting ⬢ task-app-rkh... done, v11
DB_DATABASE: [db name from heroku]
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
07:06 $ heroku config:set JWT_SECRET=[JWT secret]
Setting JWT_SECRET and restarting ⬢ task-app-rkh... done, v12
JWT_SECRET: [JWT secret]
✔ ~/projects/nestjs-training/nestjs-task-management [main|✚ 2]
```


#### Keeping Local Dev and Production
We'd like to continue with local resrouces for development and use Heroku for "production" only.  We need to update the configuration of TypeOrm in `app.module.ts` to pull he right database connection info.

The old TypeOrm looks like
```
   TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'task-management'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
```
We need some conditional logic to properly set this for secure connection in heroku. [NOTE: lets see is we can abscratthis away to ConfigService]

The update initialization looks like:
```
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('ENVIRONMENT') === 'prod';

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectionUnauthorized: false } : null,
          },
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'task-management'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    ```
