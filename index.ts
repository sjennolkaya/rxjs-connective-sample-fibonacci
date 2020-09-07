import './style.css';

import { wrap, pipe, map, filter, sink } from '@connectv/core';
import { fromEvent, timer } from 'rxjs';
import { delay, debounceTime } from 'rxjs/operators';

let textbox = document.getElementById('a');
let output = document.getElementById('p');

//
// will calculate next iteration step on fibonacci sequence
//
let m = map(([next, prev, index]) => [next + prev, next, index - 1]);
wrap(fromEvent(textbox, 'input'))                    // --> wrap the `Observable` in a `Pin`
  .to(pipe(debounceTime(1000)))                // --> wait for people to type in the number
  .to(map(() => parseInt((textbox as any).value)))   // --> map the input event to value of the input
  .to(map(n => [1, 0, n]))                     // --> map the number to start iteration
  .to(filter(([_, __, i]) => i >= 0))          // --> check if we should do any iteration
  .to(sink(t => console.clear()))              // --> clear console  
  .to(m)                                       // --> calculate next step
  .to(pipe(delay(300)))                        // --> take a breath
  .to(filter(([_, __, i]) => i > 0))           // --> check if we should continue
  .to(m)                                       // --> back to the loop
  .to(map(([_, f, __]) => f))                  // --> btw, lets take each number in the sequence
  .to(sink(() => output.classList.add('faded')))    // --> fade the <p> who is going to show the value
  .to(pipe(delay(100)))                        // --> wait for the animation
  .to(sink(v => output.innerHTML = v))              // --> set the text of <p> to the fib number
  .to(sink(v => console.log(v)))               // --> set the text of <p> to the fib number
  .to(sink(() => output.classList.remove('faded'))) // --> show the poor <p>
  .subscribe();                                // --> bind the whole thing.