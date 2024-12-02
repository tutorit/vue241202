const {dbType}=require('./config');
const {memoryDao}=require("./memorydao");
const dbDao=require("./dbdao");

const types={
    string:len => 'varchar('+len+')',
    int:'int',
    double:'decimal(10,2)',
    date:'date',
    text:'text'
};


if (dbType=='sqls'){
    types.string=len => 'nvarchar('+len+')';
}

const authors=[
    {id:1,firstName:'JRR',lastName:'Tolkien',birthDate:new Date('1892-01-03'),deathDate:new Date('1973-09-02')},
    {id:2,firstName:'Kurt',lastName:'Vonnegut',birthDate:new Date('1922-11-11'),deathDate:new Date('2007-04-11')},
    {id:3,firstName:'Ernest',lastName:'Hemingway',birthDate:new Date('1899-07-21'),deathDate:new Date('1961-07-02')},
    {id:4,firstName:'Andrea',lastName:'Camilleri',birthDate:new Date('1925-09-06'),deathDate:new Date('1919-07-17')},
];

const books=[
	{id:1,authorId:1,title:"Hobbit",description:"There and back",price:11.20,yearPublished:1937},
	{id:2,authorId:1,title:"Two Towers",description:"Some balls?",price:13.40,yearPublished:1954},
	{id:3,authorId:2,title:"Player Piano",description:"Engineers for-ever",price:14.90,yearPublished:1952},
	{id:4,authorId:3,title:"For Whom the Bell Tolls",description:"Spanish civil war",price:11.90,yearPublished:1940},
	{id:5,authorId:4,title:"The Shape of Water",description:"Montalbano investigates and eats well",price:10.15,yearPublished:1994},
];

const users=[
    {id:1,firstName:'Admin',lastName:'User',username:'admin',email:'admin@localhost',password:'admin',role:'admin',enabled:1},
    {id:2,firstName:'Mike',lastName:'Monroe',username:'mike',email:'mike@monroe.net',password:'mike',role:'user',enabled:1},
    {id:3,firstName:'John',lastName:'Wayne',username:'john',email:'john@wayne.comt',password:'john',role:'user',enabled:1},
]

const loans=[
    {id:1,userId:2,bookId:1,loanDate:new Date(),returnDate:new Date()},
    {id:2,userId:2,bookId:2,loanDate:new Date(),returnDate:new Date()},
]

const model={
    order:['author','book','person','loan'],
    book:{
        url:'books',
        table:'book',
        data:books,
        types:{
            authorId:types.int,
            title:types.string(32),
            description:types.text,
            price:types.double,
            yearPublished:types.int
        },
        required:['title'],
        foreignKeys:[
            {field:'authorId',references:'author'}
        ]
    },
    author:{
        url:'authors',
        table:'author',
        data:authors,
        types:{
            firstName:types.string(32),
            lastName:types.string(32),
            birthDate:types.date,
            deathDate:types.date,
        },
        required:['firstName','lastName']
    },
    person:{
        url:'persons',
        table:'person',
        data:users,
        types:{
            firstName:types.string(32),
            lastName:types.string(32),
            username:types.string(32),
            email:types.string(32),
            password:types.string(64),
            role:types.string(10),
            enabled:types.int
        },
        required:['firstName','lastName','username','email','password','role']
    },
    loan:{
        url:'loans',
        table:'loan',
        data:loans,
        types:{
            bookId:types.int,
            userId:types.int,
            loanDate:types.date,
            returnDate:types.date
        },
        required:['bookId','userId','loanDate'],
        foreignKeys:[
            {field:'bookId',references:'book'},
            {field:'userId',references:'person'}
        ]
    }
}



function daoFactory(entity){
    if (dbType!="memory") return dbDao(entity);
    return memoryDao(entity,model);
}

module.exports={model, daoFactory};