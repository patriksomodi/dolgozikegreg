import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import startDateJSON from "./startDate.json";

export function WorkCalendar() {
  const [currentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<Array<{ date: Date; works: boolean | null, type: string | null }>>([]);

  let startDate = new Date(`${startDateJSON.date} ${startDateJSON.time}`);
  const startType: "N" | "É" = startDateJSON.type as "N" | "É";
  const oddType = startType === "N" ? "É" : "N";
  const evenType = startType === "N" ? "N" : "É";

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = async (date: Date) => {
    const startDateResponse = await fetch("https://raw.githubusercontent.com/patriksomodi/dolgozikegreg/refs/heads/main/src/components/startDate.json");
    const startDateResponseJSON: typeof startDateJSON = await startDateResponse.json();
    startDate = new Date(`${startDateResponseJSON.date} ${startDateResponseJSON.time}`);

    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays = [];

    for (let i = 1; i < firstDayOfMonth; i++) {
      calendarDays.push({ date: new Date(year, month, i - firstDayOfMonth + 1), works: null, type: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const cycleDay = daysSinceStart % 4;
      const works = cycleDay >= 2;
      calendarDays.push({ date: currentDate, works: works, type: daysSinceStart < 0 ? null : (daysSinceStart % 8 < 2 ? evenType : oddType) });
    }

    setCalendar(calendarDays)
  }

  const daysOfWeek = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];

  return (
    <div className="flex flex-col h-full justify-center w-full">
      <div className="flex h-full justify-center w-full">
        <Card className="text-xl overflow text-center w-full h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Dolgozik-e Greg</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="font-bold">
                {currentDate.toLocaleString("hu-HU", { month: "long", year: "numeric" })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 w-full h-full">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center font-bold">{day}</div>
              ))}
              {calendar.map((day, index) => {
                const isToday = day.date.toDateString() === new Date().toDateString();
                if (day.works === null) { return <div />; }
                if (day.works !== null)
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <div key={index} className={`flex flex-col p-2 ${isToday ? "border-slate-600 border-4 rounded-xl" : "border-gray-300 border-2 rounded-xl"}`}>
                      <span className={isToday ? "font-extrabold text-slate-600" : "font-bold"}>
                        {day.date.getDate()}
                      </span>
                      {day.works && (
                        <Badge
                          variant={"secondary"}
                          className={"justify-center bg-green-600 break-word text-white font-bold flex-col h-full"}
                        >
                          <div>Sz</div>
                        </Badge>
                      )}
                      {!day.works && (day.type === oddType) && (
                        <Badge
                          variant={"secondary"}
                          className={"justify-center bg-gray-300 break-word text-black font-bold flex-col h-full"}
                        >
                          <div>É</div>
                        </Badge>
                      )}
                      {!day.works && (day.type === evenType) && (
                        <Badge
                          variant={"secondary"}
                          className={"justify-center bg-gray-300 break-word text-black font-bold flex-col h-full"}
                        >
                          <div>N</div>
                        </Badge>
                      )}
                      {!day.type && (
                        <Badge
                          variant={"secondary"}
                          className={"justify-center bg-gray-300 break-word text-black font-bold flex-col h-full"}
                        >
                          <div>N/A</div>
                        </Badge>
                      )}
                    </div>
                  );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}