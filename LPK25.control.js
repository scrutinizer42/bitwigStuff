loadAPI(20);

host.setShouldFailOnDeprecatedUse(true);

host.defineController("Akai", "LPK25", "0.1", "e5bc7093-7b9e-4831-bad2-9f917db7c485", "universejockey");

host.defineMidiPorts(1, 1);

host.addDeviceNameBasedDiscoveryPair(["LPK25 - Channel 1"], ["LPK25 - Channel 1"]);

var transport = null;

function init() {

   
   var inport = host.getMidiInPort(0);
   inport.setMidiCallback(onMidi0);

   notein = inport.createNoteInput("MyLPK25","8?????","9?????");
   
   transport = host.createTransport();

   println("LPK25 initialized!");
}

// Called when a short MIDI message is received on MIDI input port 0.
function onMidi0(status, data1, data2) {

   printMidi(status, data1, data2);
}

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}