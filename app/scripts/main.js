'use strict'

window.onload = () => {
  menu()
  // app()
}

let arrayBodies;
fetch('assets/data/bodies.json').then(function(response) {
  response.json().then(function(arrayBodies) {
    app(arrayBodies)
  })
})

// canvas here
let app = (arrayBodies) => {

// module aliases
const Engine = Matter.Engine,
     Render = Matter.Render,
     Runner = Matter.Runner,
     Composite = Matter.Composite,
     Composites = Matter.Composites,
     Common = Matter.Common,
     MouseConstraint = Matter.MouseConstraint,
     Mouse = Matter.Mouse,
     World = Matter.World,
     Events = Matter.Events,
     Bodies = Matter.Bodies,
     engine = Engine.create(),
     app = document.getElementById('app');

let newBodies = [];

// create a renderer
const render = Render.create({
    element: app,
    engine: engine,
    options: {
       width: window.innerWidth,
       height: window.innerHeight,
       wireframes: false,
       background: 'transparent'
     }
});

const mouseConstraint = Matter.MouseConstraint.create(engine, {
    element: render.canvas
});


// создание фигур
for (var bodie in arrayBodies) {
  var value = arrayBodies[bodie];

  switch(value.type) {
    case 'circle':  // если круг
      var newBodie = Bodies.circle(value.posX, value.posY, value.size, {
        collisionFilter:{
          mask: 0x0001
        },
        render: {
          fillStyle: value.color
        }
      })
      newBodies.push(newBodie)
      break;

    case 'rectangle':  // если квадрат
      var newBodie = Bodies.rectangle(value.posX, value.posY, value.width, value.height, {
        collisionFilter:{
          mask: 0x0001
        },
        render: {
          fillStyle: value.color
        }
      })
      newBodies.push(newBodie)
      break;

    case 'trapezoid':  // если трапеция
      var newBodie = Bodies.trapezoid(value.posX, value.posY, value.width, value.height, value.slope, {
        collisionFilter:{
          mask: 0x0001
        },
        render: {
          fillStyle: value.color
        }
      })
      newBodies.push(newBodie)
      break;

    case 'polygon':  // если многоугольная фигура
      var newBodie = Bodies.polygon(value.posX, value.posY, value.sides, value.size, {
        collisionFilter:{
          mask: 0x0001
        },
        render: {
          fillStyle: value.color
        }
      })
      newBodies.push(newBodie)
      break;

    default:
      console.log('default');
      break;
  }

}

// обьявление статических обьектов (земля, стены)
const statPosX = window.innerWidth/2.5;
var ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight, window.innerWidth, 40, { isStatic: true });
var groundA = Bodies.rectangle(-20, window.innerHeight, 40, window.innerHeight * 2, { isStatic: true });
var groundB = Bodies.rectangle(window.innerWidth + 20, window.innerHeight, 40, window.innerHeight * 2, { isStatic: true });



newBodies.push(ground, groundA, groundB)
// добавляем все объекты в мир
World.add(engine.world, newBodies);
World.add(engine.world, mouseConstraint);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
const mouse = Mouse.create(render.canvas);

const infoBody = document.querySelector('.content'),
      title = document.querySelector('.content-title'),
      text = document.querySelector('.content-text');

infoBody.addEventListener('click', () => {
  infoBody.classList.toggle('open')
})




    // keep the mouse in sync with rendering
    render.mouse = mouse;
    // an example of using mouse events on a mouse

    const areaCircle = document.querySelector('.area__circle')
    let boundsOne = {
      min: {
        x: window.innerWidth/2-50,
        y: window.innerHeight/2-50
      },
      max: {
        x: window.innerWidth/2 + 50,
        y: window.innerHeight/2 + 50
      }
    };
    let elem;
    let iden;
    Matter.Events.on(mouseConstraint, 'mousemove', function(event) {
        var mousePosition = event.mouse.position;
        // console.log(Matter.Query.region(Composite.allBodies(engine.world), boundsOne));
        let pair = Matter.Query.region(Composite.allBodies(engine.world), boundsOne);
        elem = pair[0];
        for (var key in elem) {
          // console.log(key);
          if (key === 'id') {
            // iden = elem[key] - 1;
            // console.log(iden);
          }
        }
        if (pair[0] != undefined) {
          areaCircle.classList.add('open')

        } else{
          areaCircle.classList.remove('open')
        }

    });

    // an example of using mouse events on a mouse
    Matter.Events.on(mouseConstraint, 'mouseup', function(event) {
        var mousePosition = event.mouse.position;

        // console.log('iden ' + iden);
        let pair = Matter.Query.region(Composite.allBodies(engine.world), boundsOne);
        elem = pair[0];
        // console.log(pair[0]);
        for (var key in elem) {
          // console.log(key);
          if (key === 'id') {
            iden = elem[key] - 1;
            // console.log(iden);
          }
          // console.log(arrayBodies[iden]);
        }

        // console.log('mouseup at ' + mousePosition.x + ' ' + mousePosition.y);

        // let iden = pair.bodyA.id - 1;
        let index = 0;
        for (var bodie in arrayBodies) {
          var value = arrayBodies[bodie];
          index++;
          if (index === iden) {
            // console.log(value.title + value.text);
            infoBody.style.backgroundColor = value.color
            title.innerHTML = value.title;
            text.innerHTML = value.text;
            // setTimeout(()=>{
              infoBody.classList.toggle('open')
            // }, 300)
            iden = undefined
          }
        }
    });

    // setInterval(function () {
    //   var addCircle = function () {
    //    return Bodies.circle(Math.random()*400 + 30, 30, 30);
    //   };
    //   World.add(engine.world, addCircle());
    //
    // }, 2000)

}

// opening tools panel

let menu = () => {
  const button = document.querySelector('.header-gamburger'),
  menu = document.querySelector('.nav');
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    menu.classList.toggle('open');
  })
}
