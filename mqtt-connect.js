var mqtt = require('mqtt')
const Influx = require('influxdb-nodejs');

var client  = mqtt.connect('tcp://iot.eclipse.org')
const client_influx = new Influx('http://127.0.0.1:8086/mqttData');

const fieldSchema = {
  external: 'integer',
  internal: 'integer',
  machine: 'string',
  type: 'string',
};



client.on('connect', function () {
  client.subscribe('sd')
  //client.publish('sd', 'Hello mqtt')
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
    var input = message.toString()
    console.log("message => "+input)

    var jinput = JSON.parse(input);
    console.log("parse => " + jinput)

    var exter = parseInt(JSON.stringify(jinput.external)) //model: 'box', week: 45
    console.log("exter => "+exter)
    var inter = parseInt(JSON.stringify(jinput.internal))
    console.log("inter => "+inter)
    var mach = JSON.parse(JSON.stringify(jinput.machine))
    console.log("mach => "+mach)
    var tp = JSON.parse(JSON.stringify(jinput.type))
    console.log("tp => "+tp)
    
    client_influx.write('temperature')
//   .tag({
//     spdy: 'fast',
//     method: 'GET',
//     type: '2',  
//   })
  .field({
    external: exter,
    internal: inter,
    machine: mach,
    type: tp,
  })
  .then(() => console.info('write point success'))
  .catch(console.error);


})


