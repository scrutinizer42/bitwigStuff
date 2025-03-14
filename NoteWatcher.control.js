loadAPI(20);

// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

host.defineController("TheUniverse", "NoteWatcher", "0.3", "9808c2c7-f29d-46e9-8c24-e942e3242832", "universejockey");
host.defineMidiPorts(1, 1);

const mListScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const mMidiOff = 128;
const mMidiOn = 144;

var mPlayedNoteCount = 0;

var mPlayedNoteList = [];

let mPlayedNoteCountLabel;
let mAllowedMajorScaleLabel;
let mAllowedMinorScaleLabel;

const mMajorNoteListByScale = 
[
  // c,c#, d,d#, e, f,f#, g,g#, a,a#, h  
   [ 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],  // c   major 0#
   [ 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],  // des major 5b
   [ 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],  // d   major 2#
   [ 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],  // es  major 3b
   [ 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],  // e   major 4#
   [ 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],  // f   major 1b
   [ 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],  // fis major 6#
   [ 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],  // g   major 1#
   [ 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],  // as  major 4b 
   [ 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],  // a   major 3#
   [ 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],  // b   major 2b
   [ 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],  // h   major 5#
];

const mMajorPlayed2ScaleMap =
[
//  c # d # e f # g # a # h - scales
   [1,0,0,1,0,1,0,1,1,0,1,0], //c   played
   [0,1,1,0,1,0,1,0,1,1,0,1], //c#  played
   [1,0,1,1,0,1,0,1,0,1,1,0], //d   played
   [0,1,0,1,1,0,1,0,1,0,1,1], //d#  played
   [1,0,1,0,1,1,0,1,0,1,0,1], //e   played
   [1,1,0,1,0,1,1,0,1,0,1,0], //f   played
   [0,1,1,0,1,0,1,1,0,1,0,1], //f#  played
   [1,0,1,1,0,1,0,1,1,0,1,0], //g   played
   [0,1,0,1,1,0,1,0,1,1,0,1], //g#  played
   [1,0,1,0,1,1,0,1,0,1,1,0], //a   played
   [0,1,0,1,0,1,1,0,1,0,1,1], //a#  played
   [1,1,1,0,1,0,1,1,0,1,0,1], //h   played
];

mMajorPlayedNoteList =
[
   [0,0,0,0,0,0,0,0,0,0,0,0], //  1. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  2. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  3. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  4. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  5. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  6. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  7. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  8. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  9. played
   [0,0,0,0,0,0,0,0,0,0,0,0], // 10. played
   [0,0,0,0,0,0,0,0,0,0,0,0], // 11. played
   [0,0,0,0,0,0,0,0,0,0,0,0], // 12. played
];


mMajorAllowedScales = [0,0,0,0,0,0,0,0,0,0,0,0];


const mMinorNoteListByScale = 
[
  // c,c#, d,d#, e, f,f#, g,g#, a,a#, h 
   [ 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],  // c   minor 3b
   [ 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],  // c#  minor 4#  
   [ 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],  // d   minor 1b
   [ 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],  // dis minor 6#  
   [ 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],  // e   minor 1#
   [ 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],  // f   minor 4b
   [ 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],  // fis minor 3#
   [ 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],  // g   minor 2b
   [ 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],  // gis minor 5#
   [ 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0],  // a   minor 0#
   [ 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],  // b   minor 5b
   [ 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],  // h   minor 2#

];

const mMinorPlayed2ScaleMap =
[
//  c # d # e f # g # a # h - scales
   [1,0,1,0,1,1,0,1,0,1,1,0], //c   played
   [0,1,0,1,0,1,1,0,1,0,1,1], //c#  played
   [1,0,1,0,1,0,1,1,0,1,0,1], //d   played
   [1,1,0,1,0,1,0,1,1,0,1,0], //d#  played
   [0,1,1,0,1,0,1,0,1,1,0,1], //e   played
   [1,0,1,1,0,1,0,1,0,1,1,0], //f   played
   [0,1,0,1,1,0,1,0,1,0,1,1], //f#  played
   [1,0,1,0,1,1,0,1,0,1,0,1], //g   played
   [1,1,0,1,0,1,1,0,1,0,1,0], //g#  played
   [0,1,1,0,1,0,1,1,0,1,0,1], //a   played
   [1,0,1,1,1,1,0,1,1,0,1,0], //a#  played
   [0,1,0,1,1,0,1,0,1,0,0,1], //h   played
];

mMinorPlayedNoteList =
[
   [0,0,0,0,0,0,0,0,0,0,0,0], //  1. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  2. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  3. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  4. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  5. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  6. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  7. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  8. played
   [0,0,0,0,0,0,0,0,0,0,0,0], //  9. played
   [0,0,0,0,0,0,0,0,0,0,0,0], // 10. played
   [0,0,0,0,0,0,0,0,0,0,0,0], // 11. played
   [0,0,0,0,0,0,0,0,0,0,0,0], // 12. played
];

mMinorAllowedScales = [0,0,0,0,0,0,0,0,0,0,0,0];

function addAllowedScale2PlayList(playedNoteIndex,mapIndex)
{
   for(let i = 0;i < 12;i++)
   {
      mMajorPlayedNoteList[playedNoteIndex][i] = mMajorPlayed2ScaleMap[mapIndex][i];

      mMinorPlayedNoteList[playedNoteIndex][i] = mMinorPlayed2ScaleMap[mapIndex][i];
   }
   for(let i = 0; i < 12;i++)
   {
      ShowArrayContent(mMajorPlayedNoteList[i],"mMajorPlayedNoteList", i);

      ShowArrayContent(mMinorPlayedNoteList[i],"mMinorPlayedNoteList", i);
   } 
}

function removeAllowedScaleFromPlayList(playedNoteIndex)
{
   mMajorPlayedNoteList[playedNoteIndex].fill(0);

   mMinorPlayedNoteList[playedNoteIndex].fill(0);
}

function calcAllowedScales(mPlayedNoteCount)
{
   var allowedMajorScales = "";

   var allowedMinorScales = "";

   if(mPlayedNoteCount == 0)
   {
      mMajorAllowedScales.fill(0);

      mMinorAllowedScales.fill(0);

      println("no scales found");
   }
   else
   {
      for(let j = 0;j < mPlayedNoteCount;j++)
      {
         for(let i = 0; i < 12;i++)
         {
            if(j == 0)
            {
               mMajorAllowedScales[i] = mMajorPlayedNoteList[j][i];

               mMinorAllowedScales[i] = mMinorPlayedNoteList[j][i]; 

            }
            else
            {
               mMajorAllowedScales[i] = mMajorPlayedNoteList[j][i] & mMajorAllowedScales[i]; 

               mMinorAllowedScales[i] = mMinorPlayedNoteList[j][i] & mMinorAllowedScales[i]; 
            }
         }        
      }

      for(let i = 0; i < 12;i++)
      {
         if(mMajorAllowedScales[i] == 1)
         {
            if(allowedMajorScales == "")
            {
               allowedMajorScales = mListScale[i];
            }
            else
            {
               allowedMajorScales =  allowedMajorScales + "," + mListScale[i];
            }
         }

         if(mMinorAllowedScales[i] == 1)
         {
            if(allowedMinorScales == "")
            {
               allowedMinorScales = mListScale[i];
            }
            else
            {
               allowedMinorScales =  allowedMajorScales + "," + mListScale[i];
            }
         }

      }

      println("major scales found: " + allowedMajorScales);
      println("minor scales found: " + allowedMinorScales);

   }

   mAllowedMajorScaleLabel.set(allowedMajorScales);
   mAllowedMinorScaleLabel.set(allowedMinorScales);
   
}

function initSimpleWatcher()
{
    var inputPort = host.getMidiInPort(0);
   inputPort.setMidiCallback(onMidi0);

   var noteIn = inputPort.createNoteInput("Notes");
   noteIn.setShouldConsumeEvents(false);
}

function InitUi1Watcher()
{
   documentState = host.getDocumentState()

   for(var i = 0; i < 12;i++)
   {
      mPlayedNoteList[i] = documentState.getStringSetting(mListScale[i],"result",20,"");
   }

   mPlayedNoteCountLabel = documentState.getStringSetting("Note count" ,"count",20,"0");
   mAllowedMajorScaleLabel = documentState.getStringSetting("Possible major scales" ,"scales",20,"");
   mAllowedMinorScaleLabel = documentState.getStringSetting("Possible minor scales" ,"scales",20,"");
}

function init() {

  initSimpleWatcher();
  InitUi1Watcher();

   
   println("NoteWatcher initialized!");
}


function flush() {
   
}

function info() {
   host.showPopupNotification("Written by universejockey");
}

function exit() {
   println("Bye NoteWatcher");

}

function ShowArrayContent(myArray,arrayName,index)
{
   var txt = "";

   for(let i = 0; i < myArray.length;i++)
   {
      txt = txt + myArray[i] + ",";
   }

   println(arrayName + "[" + index + "] : " + txt);
}

function evaluate(status, data1, data2)
{
   // show played note and count of pressed keys:

   var idx = data1 % 12;
   var note = mListScale[idx];

   if(status == mMidiOff)
   {
      mPlayedNoteList[idx].set("");
      mPlayedNoteCount--;
      removeAllowedScaleFromPlayList(mPlayedNoteCount);

   }
   else if(status == mMidiOn)
   {
      mPlayedNoteList[idx].set("X");

      // add allowed scales from a played key:
      addAllowedScale2PlayList(mPlayedNoteCount,idx);

      mPlayedNoteCount++;
   }
   mPlayedNoteCountLabel.set(mPlayedNoteCount);
   calcAllowedScales(mPlayedNoteCount);

}

function onMidi0(status, data1, data2)
{

    evaluate(status,data1,data2);

    //printMidi(status, data1, data2);
}