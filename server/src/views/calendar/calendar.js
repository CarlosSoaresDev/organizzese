const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

function app() {
    return {
        month: null,
        year: null,
        no_of_days: [],
        blankdays: [],
        days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
        events: [],

        id: null,
        eventTitle: null,
        eventDate: null,
        eventTheme: 'blue',
        startTime: null,
        endTime: null,
        totalHours: null,

        themes: [
            {
                value: "blue",
                label: "Tarefas"
            },
            {
                value: "red",
                label: "Reuniões"
            },
            {
                value: "yellow",
                label: "Treinamento"
            },
            {
                value: "green",
                label: "Ajudas"
            }
        ],

        openEventModal: false,

        initialize() {

            const user = JSON.parse(localStorage.getItem("user"))
            if (!user)
                window.location.replace("/login");

            let today = new Date();
            this.month = today.getMonth();
            this.year = today.getFullYear();
            this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString();

            this.getData("api/calendar", null).then(async data => {
                if (data.status == 401 || data.status == 403)
                    window.location.replace("/login");

                this.events = await data.json()
            }).catch(error => { throw new Error(error) });
        },

        async getData(url = "") {

            const token = JSON.parse(localStorage.getItem("user")).token

            const response = await fetch(url, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
            });

            return response;
        },

        async postData(url = "", data) {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(data),
            });
            return response.json();
        },

        calculateHours() {
            if (this.startTime != null && this.endTime != null) {
                var diff = moment(this.endTime, "HH:mm").diff(moment(this.startTime, "HH:mm"));
                var duration = moment.duration(diff);
                this.totalHours = Math.floor(duration.asHours()) + "h" + moment.utc(diff).format(" mm") + "m";
            }
        },

        setYear(isUp) {
            if (isUp == true && this.month == 0)
                this.year++
            else if (isUp == false && this.month == 11)
                this.year--
        },

        isToday(day) {
            const today = new Date();
            const date = new Date(this.year, this.month, day);
            return today.toDateString() === date.toDateString() ? true : false;
        },

        showEventModal(day) {
            this.openEventModal = true;
            this.eventDate = new Date(this.year, this.month, day).toDateString();
        },

        showEditEventModal(event) {
            this.id = event.id;
            this.eventTitle = event.eventTitle;
            this.eventDate = new Date(event.eventDate).toDateString()
            this.eventTheme = event.event_theme;
            this.endTime = event.endTime;
            this.startTime = event.startTime;
            this.totalHours = event.totalHours;

            this.openEventModal = true;
        },

        addEvent() {
            if (this.eventTitle == '')
                return;

            const data = {
                eventDate: this.eventDate,
                eventTitle: this.eventTitle,
                eventTheme: this.eventTheme,
                startTime: this.startTime,
                endTime: this.endTime,
                totalHours: this.totalHours
            }

            this.postData("api/calendar", data)
                .then(result => {
                    this.clean()
                    this.openEventModal = false;
                    this.events.push(result);
                });
        },

        clean() {
            this.eventTitle = null;
            this.eventDate = null;
            this.eventTheme = 'blue';
            this.endTime = null;
            this.startTime = null;
            this.totalHours = null;
        },

        getNoOfDays() {
            let daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

            let dayOfWeek = new Date(this.year, this.month).getDay();
            let blankdaysArray = [];
            for (var i = 1; i <= dayOfWeek; i++)
                blankdaysArray.push(i);

            let daysArray = [];

            for (var i = 1; i <= daysInMonth; i++)
                daysArray.push(i);

            this.blankdays = blankdaysArray;
            this.no_of_days = daysArray;
        }
    }
}