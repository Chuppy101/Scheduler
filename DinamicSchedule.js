const readline = require("readline")

// Конвертируем время из формата HH:MM в минуты
const convertTimeToMinutes = (time) => {
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}

// Конвертируем минуты в формат HH:MM
const convertMinutesToTime = (minutes) => {
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60
	return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
}

// Обрабатываем занятые временные слоты, сортируем их
const processBusySlots = (busySlots) => {
	return busySlots
		.map((slot) => ({
			start: convertTimeToMinutes(slot.start),
			stop: convertTimeToMinutes(slot.stop),
		}))
		.sort((a, b) => a.start - b.start)
}

// Получаем свободные слоты
const getFreeSlots = (start, end, busySlots) => {
	const startTime = convertTimeToMinutes(start)
	const endTime = convertTimeToMinutes(end)
	// Обрабатываем и сортируем занятые слоты
	const processedBusySlots = processBusySlots(busySlots)

	const freeSlots = []
	let currentTime = startTime

	// Итерируем по занятым слотам и находим свободные слоты
	processedBusySlots.forEach((slot) => {
		while (currentTime + 30 <= slot.start) {
			freeSlots.push({
				start: convertMinutesToTime(currentTime),
				stop: convertMinutesToTime(currentTime + 30),
			})
			currentTime += 30
		}
		currentTime = Math.max(currentTime, slot.stop)
	})

	// Проверяем наличие свободных слотов после последнего занятого слота
	while (currentTime + 30 <= endTime) {
		freeSlots.push({
			start: convertMinutesToTime(currentTime),
			stop: convertMinutesToTime(currentTime + 30),
		})
		currentTime += 30
	}
	// Возвращаем список свободных слотов
	return freeSlots
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const busySlots = []

// Спрашиваем временные слоты у пользователя
const askForSlot = () => {
	rl.question(
		"Введите время начала занятости (формат HH:MM) или оставьте пустым для завершения: ",
		(start) => {
			if (start === "") {
				// Если ввод пустой, завершаем ввод и выводим свободные слоты
				const freeSlots = getFreeSlots("09:00", "21:00", busySlots)
				console.log("Свободные слоты:", freeSlots)
				rl.close()
			} else {
				rl.question(
					"Введите время окончания занятости (формат HH:MM): ",
					(stop) => {
						busySlots.push({ start, stop }) // Добавляем занятый слот в массив
						console.log(`Занятый слот добавлен: ${start} - ${stop}`)
						askForSlot() // Спрашиваем следующий слот
					}
				)
			}
		}
	)
}

askForSlot() // Начинаем процесс запроса слотов у пользователя
