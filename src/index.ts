#!/usr/bin/env node
import cac from "cac";
import mqtt from "mqtt";

const cli = cac();

cli.command("start", "Starts a simulator that sends temperatures to a MQTT topic")
.option("-n <numberOfSimulators>", "Number of simulators")
.option("-p <port>", "Password MQTT broker")
.option("-i <ip>", "IP MQTT broker")
.action((options: {n: number, p: number, i: string}) => {
    console.log(options);

    for (let index = 0; index < options.n; index++) {
        const mqttUrl = `mqtt://${options.i}:${options.p}`;
        const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
        const topic = `/tim/temperatures`;
    
        const client = mqtt.connect(mqttUrl, {
            clientId,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000
        });
    
        client.on("connect", () => {
            console.log("connected");
            client.publish(
                topic,
                `The temperature is: ${Math.random().toString(2)}`,
                {qos: 0, retain:false},
                (error => {
                    if (error) {console.error(error);}
                })
            )
        });            
    }
});

cli.help();
cli.version("0.0.1");
cli.parse();
