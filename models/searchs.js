const fs = require('fs')

const axios = require('axios')
class Searches {
    historial = []
    dbPath = './db/database.json'

    constructor() {
        // TODO: Read from DB
        this.readDB()
    }

    get capitalizeHistory() {
        // Capitalizar cada palabra
        return this.historial.map( place => {
            let words = place.split(' ')
            words = words.map( p => p[0].toUpperCase() + p.substring(1) ) 
            return words.join(' ')
        })
    }

    get paramsMapbox() {
        return {
            'access_token': 'pk.eyJ1IjoiYWxiZXJ0b2FsZWphbmRybzEwIiwiYSI6ImNsNGV4dms0cjAxYXQzZHRqYTJjeDF5d2cifQ.xIqlRNf2e9xwmLGZ2piWOQ',
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather() {
        return {
            'appid': '00d2602803a771cccdb97ca1aaea389e',
            'lang': 'es',
            'units': 'metric'
        }
    }

    async city( place = '' ) {
        try {
            // TODO: Http request
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get()
            return resp.data.features.map( place => ({
                id: place.id,
                nombre: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }))
            
        } catch ( error ) {
            return []
        }
    }

    async weatherCity( lat, lon ) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            })

            const resp = await instance.get()
            const { weather, main } = resp.data
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
                        
        } catch ( error ) {
            console.log(error)
        }     
    }

    addHistory( place = '' ) {
        if ( this.historial.includes( place.toLocaleLowerCase() )) {
            return
        }
        this.historial = this.historial.splice(0, 5)
        // TODO: Prevenir duplicados
        this.historial.unshift( place.toLocaleLowerCase() )
        // Grabar en DB
        this.saveDB()
    } 

    saveDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ))        
    }

    readDB() {
        if ( ! fs.existsSync( this.dbPath )) return
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse( info )
        this.historial = data.historial
    }
}

module.exports = Searches