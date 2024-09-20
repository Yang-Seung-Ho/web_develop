function myName(name){
    return `Hello My name is ${name}...`;
}
function myHobby(hobby){
    return `My hobby is ${hobby}`;
}
function myFavorite(food){
    return `And my favorite food is ${food}...`;
}

const name = myName("YANG SEUNG HO");
const hobby = myHobby("Soccer and Game and Watching Movie ^^");
const food = myFavorite("국밥!!!");

const messages = [name, hobby, food];

let currentIndex = 0;


const intervalID = setInterval(myCallback, 3000);

function myCallback() {
  if (currentIndex < messages.length) {    
    document.write(`${messages[currentIndex]}<br>`);
    currentIndex++;
  } else if(currentIndex == messages.length) {
    return
  } 
  else {    
    clearInterval(intervalID);
  }
}
