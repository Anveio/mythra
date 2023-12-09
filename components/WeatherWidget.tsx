import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Label } from "react-aria-components";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
interface Props {
  endpoint: string;
  baseUrl: string;
  params: {
    city?: string;
  };
  request?: {
    headers: {
      token?: string;
      cookies?: string;
    };
  };
  response?: {};
}

const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export const WeatherWidget = (props: Props) => {
  const [temperature, setTemperature] = useState<number>(() => {
    return Math.floor(Math.random() * 78);
  });
  const [windSpeed, setWindSpeed] = useState(() => {
    return {
      velocity: Math.floor(Math.random() * 5),
      direction: directions[Math.floor(Math.random() * directions.length)],
    };
  });

  const [unitsOfMeasurement, setUnitsOfMeasurement] = useState({
    temperature: "F",
    speed: "mph",
  });

  const [propsCopy, setPropsCopy] = useState({ ...props });

  const {
    endpoint,
    baseUrl,
    params: { city },
  } = propsCopy;

  console.log(unitsOfMeasurement);

  if (!city) {
    return (
      <div>
        <h1>Get the temperature in any city</h1>
        <div>
          <form
            onSubmit={() => {
              setPropsCopy((prev) => {
                return {
                  ...prev,
                  params: {
                    ...prev.params,
                    city: "Seattle",
                  },
                };
              });
            }}
          >
            <input type="text" placeholder="City name" />
            <button
              onClick={() => {
                setPropsCopy((prev) => {
                  return {
                    ...prev,
                    params: {
                      ...prev.params,
                      city: "Seattle",
                    },
                  };
                });
              }}
            >
              Go
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
      }}
      exit={{ opacity: 0 }}
      className="col-span-6 w-full"
    >
      <Card>
        <CardHeader>
          <div className="grid gap-3 grid-cols-[48px_48px_1fr]">
            <Button variant={"outline"}>
              <ArrowLeft />
            </Button>
            <Button variant={"outline"}>
              <ArrowRight />
            </Button>
            <form>
              <div className="flex flex-row gap-2">
                <Input type="text" readOnly value={baseUrl} />
                <Button type="submit" variant={"secondary"}>
                  Go
                </Button>
              </div>
            </form>
          </div>
        </CardHeader>
        <div className="flex flex-col space-y-6 w-full">
          <div className="flex flex-col items-center space-y-4 w-full">
            <h1 className="font-book font-styling font-display font-effect-hero text-center md:text-left text-[4rem] md:text-7xl leading-[4.35rem] md:leading-[5rem] tracking-tight font-gradient">
              {city}
            </h1>
            <h2 className="text-lg text-center">
              Temperature:{" "}
              {unitsOfMeasurement.temperature === "F"
                ? temperature
                : (temperature - 32) * (5 / 9)}
              °F
            </h2>
            <h2 className="text-lg text-center">
              Wind:{" "}
              {windSpeed.velocity *
                (unitsOfMeasurement.speed === "mph" ? 1 : 1.60934)}
              {unitsOfMeasurement.speed} {windSpeed.direction}
            </h2>
          </div>
          <div className="p-2 space-x-2">
            <div className="flex-col">
              <Select>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Units of Measurement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Temperature</SelectLabel>
                    <SelectItem
                      value="F"
                      onSelect={() => {
                        setUnitsOfMeasurement((prev) => {
                          return {
                            ...prev,
                            temperature: "F",
                          };
                        });
                      }}
                    >
                      °F
                    </SelectItem>
                    <SelectItem
                      value="C"
                      onSelect={() => {
                        setUnitsOfMeasurement((prev) => {
                          return {
                            ...prev,
                            temperature: "F",
                          };
                        });
                      }}
                    >
                      °C
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Speed</SelectLabel>
                    <SelectItem
                      value="mph"
                      onSelect={() => {
                        setUnitsOfMeasurement((prev) => {
                          return {
                            ...prev,
                            speed: "mph",
                          };
                        });
                      }}
                    >
                      Miles / Hour
                    </SelectItem>
                    <SelectItem
                      value="kph"
                      onSelect={() => {
                        setUnitsOfMeasurement((prev) => {
                          return {
                            ...prev,
                            speed: "kph",
                          };
                        });
                      }}
                    >
                      Kilometres / Hour
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
