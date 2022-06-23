require('dotenv').config()

const {
    inquirerMenu,
    readInput,
    pause,
    listPlaces
} = require('./helpers/inquirer')
const Searches = require('./models/searchs')
// console.log( process.env )

const main = async() => {
    const searches = new Searches()
    let opt
    do {
        opt = await inquirerMenu()
        switch ( opt ) {
            case 1:
                // Mostrar mensaje
                const query = await readInput('Ciudad: ')
                // Buscar los lugares
                const places = await searches.city( query )
                // Seleccionar el lugar
                const id = await listPlaces(places)
                if ( id === '0' ) continue
                const selectedPlace = places.find( x => x.id === id)
                searches.addHistory( selectedPlace.nombre ) 
                // console.log( selectedPlace )
                // Clima
                const weather = await searches.weatherCity( selectedPlace.lat, selectedPlace.lng )
                // console.log( 'Clima: ', weather )

                // Mostrar resultados
                console.clear()
                console.log('\nInformación de la ciudad\n'.green)
                console.log('Ciudad:', selectedPlace.nombre.green )
                console.log('Lat:', selectedPlace.lat)
                console.log('Lng:', selectedPlace.lng)
                console.log('Temperatura:', weather.temp)
                console.log('Mínima:', weather.min)
                console.log('Máxima:', weather.max)
                console.log('Como esta el clima:', weather.desc.green)
                break
            case 2:
                searches.capitalizeHistory.forEach( (place, index) => {
                    const idx = `${ index + 1 }.`.green
                    console.log( `${ idx } ${ place }` )
                })

                break
        }
        if ( opt !== 0 ) await pause()
    } while ( opt !== 0 )
}

main()