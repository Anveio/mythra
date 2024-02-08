import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
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
  request?: {
    headers: {
      token?: string;
      cookies?: string;
    };
  };
  response?: {};
  historyForUrl: URL[];
}

const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

/**
 * Function to take a base url and query params and return a url.
 * It handles the case where values in `params` might be undefined.
 */
const createUrl = (
  baseUrl: string,
  params: Record<string, string | undefined>
) => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};

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

  const [historyIndex, setHistoryIndex] = useState(0);
  console.log("🚀historyForUrl", props.historyForUrl);

  const [propsCopy, setPropsCopy] = useState({ ...props });

  React.useEffect(() => {
    setHistoryIndex((prev) => {
      return Math.max(prev, props.historyForUrl.length - 1);
    });
  }, [props.historyForUrl]);

  React.useEffect(() => {
    if (cardElementRef.current) {
      setTimeout(() => {
        cardElementRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    }
  }, [props.historyForUrl.length]);

  const [unitsOfMeasurement, setUnitsOfMeasurement] = useState({
    temperature: "F",
    speed: "mph",
  });

  const url = propsCopy.historyForUrl[historyIndex];

  console.log("url", url);
  const [urlInput, setUrlInput] = React.useState(url.toString());

  React.useEffect(() => {
    setUrlInput(url.toString());
  }, [url]);

  const city = url.searchParams.get("city");

  React.useEffect(() => {
    if (city) {
      setWindSpeed(() => {
        return {
          velocity: Math.floor(Math.random() * 5),
          direction: directions[Math.floor(Math.random() * directions.length)],
        };
      });
      setTemperature(() => {
        return Math.floor(Math.random() * 78);
      });
    }
  }, [city]);

  const cardElementRef = React.useRef<HTMLDivElement>(null);

  if (!city) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
        }}
        className="col-span-6 w-full "
      >
        <Card ref={cardElementRef} className="pb-6">
          <CardHeader>
            <div className="grid gap-3 grid-cols-[48px_48px_1fr]">
              <Button
                variant={"outline"}
                disabled={historyIndex === 0}
                id="back-button"
                name="back-button"
                onClick={() => {
                  console.log("IN HERE");
                  setHistoryIndex((prev) => {
                    return prev - 1;
                  });
                }}
              >
                <ArrowLeft />
              </Button>
              <Button
                variant={"outline"}
                id="forward-button"
                name="forward-button"
                onClick={() => {
                  setHistoryIndex((prev) => {
                    return prev + 1;
                  });
                }}
                disabled={historyIndex === propsCopy.historyForUrl.length - 1}
              >
                <ArrowRight />
              </Button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const urlString = formData.get("address-bar") as string;

                  try {
                    const urlStringAsUrl = new URL(urlString);

                    if (urlStringAsUrl.href === url.href) {
                      return;
                    }

                    setPropsCopy((prev) => {
                      return {
                        ...prev,
                        historyForUrl: [...prev.historyForUrl, urlStringAsUrl],
                      };
                    });
                    setHistoryIndex((prev) => {
                      return prev + 1;
                    });
                  } catch (e) {
                    console.error;
                  }
                }}
              >
                <div className="flex flex-row gap-2">
                  <Input
                    type="text"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                    }}
                    id="address-bar"
                    name="address-bar"
                  />
                  <Button type="submit" variant={"secondary"}>
                    Go
                  </Button>
                </div>
              </form>
            </div>
          </CardHeader>
          <div className="flex flex-col space-y-6 w-full">
            <div className="flex flex-col items-center space-y-4 w-full">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: 1,
                }}
                className="font-book font-styling font-display font-effect-hero text-center md:text-left text-[4rem] md:text-7xl leading-[4.35rem] md:leading-[5rem] tracking-tight font-gradient"
              >
                {startCase(city)}
              </motion.h1>
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
            {/* <div className="p-2 space-x-2">
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
            </div> */}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * StartCase function
 */
const startCase = (str: string) => {
  return str
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
};
