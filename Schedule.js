// Исходные данные
const busy = [
	{ start: "10:30", stop: "10:50" },
	{ start: "18:40", stop: "18:50" },
	{ start: "14:40", stop: "15:50" },
	{ start: "16:40", stop: "17:20" },
	{ start: "20:05", stop: "20:20" },
]

// Функция для конвертации времени из формата HH:MM в минуты
function convertTimeToMinutes(time) {
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}

// Функция для конвертации времени из минут в формат HH:MM
function convertMinutesToTime(minutes) {
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60
	return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
}

// Функция для получения свободных временных слотов
function getFreeSlots(start, end, busySlots) {
	const startTime = convertTimeToMinutes(start)
	const endTime = convertTimeToMinutes(end)
	// Сортируем занятые слоты по времени начала
	busySlots = busySlots
		.map((slot) => ({
			start: convertTimeToMinutes(slot.start),
			stop: convertTimeToMinutes(slot.stop),
		}))
		.sort((a, b) => a.start - b.start)

	const freeSlots = []
	let currentTime = startTime

	// Итерируем по занятым слотам и находим свободные слоты
	for (const slot of busySlots) {
		while (currentTime + 30 <= slot.start) {
			freeSlots.push({
				start: convertMinutesToTime(currentTime),
				stop: convertMinutesToTime(currentTime + 30),
			})
			currentTime += 30
		}
		// Обновляем текущее время до конца занятого слота
		currentTime = Math.max(currentTime, slot.stop)
	}

	// Проверяем наличие свободных слотов после последнего занятого слота
	while (currentTime + 30 <= endTime) {
		freeSlots.push({
			start: convertMinutesToTime(currentTime),
			stop: convertMinutesToTime(currentTime + 30),
		})
		currentTime += 30
	}

	return freeSlots // Возвращаем список свободных слотов
}

// Получаем свободные слоты для заданного рабочего времени и занятых слотов
const freeSlots = getFreeSlots("09:00", "21:00", busy)
console.log("Free slots:", freeSlots)
