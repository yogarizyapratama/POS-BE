 npm i zod           
 npm i express                  
 npm i --save-dev @types/express
 npm i --save-dev prisma        
 npm i winston           
 npm i bcrypt 
 npm i --save-dev @types/bcrypt
 npm i uuid             
 npm i --save-dev @types/uuid
 npm i --save-dev jest @types/jest
 npm i --save-dev babel-jest @babel/preset-env
 npm i --save-dev @babel/preset-typescript
 npm i --save-dev @jest/globals
 npm i --save-dev supertest @types/supertest
 npm i --save-dev typescript

 add this
 "scripts": {
    "test": "jest"
  },
  "jest": {
    "transform": {
      "^.+\\.[t|j]sx?$": "babel-jest"
    }
  },

