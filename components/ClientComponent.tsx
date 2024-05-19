"use client";
import {
    VoiceProvider,
    ToolCall,
    ToolCallHandler,
    ToolResponse,
    ToolError,
} from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import Airports from './airports.json';
import Cities from './cities.json'

const handleToolCall: ToolCallHandler = async (
    toolCall: ToolCall
): Promise<ToolResponse | ToolError> => {
    console.log("Tool call received", toolCall);

    if (toolCall.name === 'get_flight_price') {
        try {
            const args = JSON.parse(toolCall.parameters) as {
                departure: string;
                arrival: string;
                date_of_travel: string;
            };

            const deptCityCode = Cities.find((city: any) => city.name === args.departure).code;
            const arrCityCode = Cities.find((city: any) => city.name === args.arrival).code;


            const departureAirport = Airports.find((airport: any) => airport.city_code === deptCityCode).code;
            const arrivalAirport = Airports.find((airport: any) => airport.city_code === arrCityCode).code;

            const resp2 = await fetch('/api/fetchCheapPrices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    departureAirport,
                    arrivalAirport,
                    date_of_travel: args.date_of_travel,
                }),
            });
            const flightPrice = await resp2.json();
            if (flightPrice.length === 0) {
                return {
                    type: 'tool_response',
                    tool_call_id: toolCall.tool_call_id,
                    content: 'No Flights Found',
                };
            }

            console.log(flightPrice);
            return {
                type: 'tool_response',
                tool_call_id: toolCall.tool_call_id,
                content: JSON.stringify(flightPrice),
            };
        } catch (error) {
            return {
                type: 'tool_error',
                tool_call_id: toolCall.tool_call_id,
                error: 'Weather tool error',
                code: 'weather_tool_error',
                level: 'warn',
                content: 'There was an error with the weather tool',
            };
        }
    } else {
        return {
            type: 'tool_error',
            tool_call_id: toolCall.tool_call_id,
            error: 'Tool not found',
            code: 'tool_not_found',
            level: 'warn',
            content: 'The tool you requested was not found',
        };
    }
};

export default function ClientComponent({
    accessToken,
}: {
    accessToken: string;
}) {
    return (
        <VoiceProvider
            configId={process.env.NEXT_PUBLIC_HUME_CONFIG_ID || ""}
            auth={{ type: "accessToken", value: accessToken }}
            onToolCall={handleToolCall}
        >
            <div className="h-[100vh] flex w-full ">
                <div className="flex items-center p-5 ">
                    <div>
                        <div id="mic" className="w-[400px]">

                        </div>
                    </div>

                </div>


                <Messages />
                <Controls />


            </div>

        </VoiceProvider>
    );
}