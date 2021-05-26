var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

var feed;
var lastFed;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog)

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 

  fedTime = database.ref("feedTime");
  fedTime.on("value" , function(data ){
    lastFed = data.val();
  });

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30); 
  }else if(lastFed==0){
    text("Last Feed : 12am" , 350 , 30);
  }else{
    text("Last Feed : "+ lastFed + " AM", 350,30);
  }
  
 
  //write code to display text lastFed time here

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var foodStock = foodObj.getFoodStock();
  if(foodStock <= 0){
    foodObj.updateFoodStock(foodStock*0);
  }else{
    foodObj.updateFoodStock(foodStock-1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
  });
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
