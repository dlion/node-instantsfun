#!/usr/bin/env node
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Domenico Luciani <domenicoleoneluciani@gmail.com> (http://dlion.it)
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var instantsfun = require('../lib/instantsfun.js'),
    blessed     = require('blessed'),
    exec        = require('child_process').exec;


//Create a screen object
var screen = blessed.screen();

/**
 * Ncurses
 */

//Table
var table = blessed.box({
  left: 0,
  top: 0,
  width: screen.width,
  height: screen.height
});
//On the table there is a title
var title   = blessed.box({
  top: '1%',
  height: '4%',
  width: screen.width,
  align: 'center',
  content: '{red-fg}Node{/red-fg}-InstantsFun!',
  tags: true,
  style: {
    fg: 'white',
    bg: 'blue'
  }
});

//List on the table
var list = blessed.list({
  selectedFg: 'gray',
  selectedBg: 'white',
  parent: table,
  top: '4%',
  left: 0
});

//Initial Message
var message = blessed.box({
  width: '50%',
  height: 3,
  border: {
    type: 'line'
  },
  tags: true,
  top: 'center',
  left: 'center',
  content: "{center}Fetching data from the web, please wait...{/center}"
});


/**
 * Append object into screen and table
 */
screen.append(table);
table.append(title);
table.append(message);
screen.render();

// My index List
var arrayIndex = 0;
//Session
var mplayer = null;


/**
 * Exit
 */
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

/**
 * Retrieve all sounds
 */
instantsfun.getAllList(function(obj) {
  var index;
  //Add all title into list
  for(index in obj) {
    list.add(obj[index].title);
  }
  //Add to table box
  table.append(list);

  /**
   * When Press a key into list
   */
  list.on('keypress', function(ch, key) {
    if(key.name === "down") {
      list.down(1);
      //Put down and decrease the index
      if(arrayIndex < obj.length-1) {
        arrayIndex += 1;
      }
    } else if(key.name === "up") {
      list.up(1);
      //Put up and increase the index
      if(arrayIndex > 0) {
        arrayIndex -= 1;
      }
    } else if(key.name === "enter") {
      //Execute music
      mplayer = exec("mplayer "+obj[arrayIndex].song);
    } else if(key.name === "x") {
      //Kill the music
      if(mplayer !== null) {
        mplayer.kill();
      }
    }

    screen.render();
  });

  list.focus();
  screen.render();
});
