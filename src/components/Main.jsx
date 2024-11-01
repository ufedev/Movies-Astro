import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Card } from '@/components/ui/Card'
import { Search } from "@/components/ui/Search"

export const Main = () => {

    const [page, setPage] = useState(1)
    const [genders, setGenders] = useState([])
    const [selectedGender, setSelectedGender] = useState("")
    const [movies, setMovies] = useState([])
    const [filteredMovies, setFilteredMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const config = {
        headers: {
            authorization: `Bearer ${import.meta.env.PUBLIC_API_TOKEN}`,
            'content-type': 'application/json'
        }
    }

    const getGenders = async () => {
        try {
            const url = `https://api.themoviedb.org/3/genre/movie/list?language=es`
            const req = await fetch(url, config)
            const res = await req.json()

            if (req.status === 200) {
                setGenders(res.genres)
            }
        } catch (err) {
            console.error(err)
        }
    }
    const addPage = () => {
        setPage(page + 1)
    }
    const getMovies = async () => {
        try {

            setLoading(true)
            const url = `https://api.themoviedb.org/3/movie/popular?language=es-ES&page=${page}`

            const req = await fetch(url, config)

            if (req.status === 200) {
                const res = await req.json()
                setMovies(movies.concat(res.results))
            }


        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }


    const filterMovies = () => {

        if (selectedGender === "") {
            setFilteredMovies(movies)
        } else {
            const fm = movies.filter(movie => {
                if (movie.genre_ids.includes(Number(selectedGender))) {
                    return movie
                }
            })

            setFilteredMovies(fm)

        }
    }


    useEffect(() => {
        getGenders()
    }, [])


    useEffect(() => {
        getMovies()
    }, [page])

    useEffect(() => {
        filterMovies()
    }, [movies, selectedGender])




    // console.log(movies[0])

    return <div className='contenedor main'>

        <Search
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            genders={genders}
        />

        <section className='main__cards'>


            {
                filteredMovies.map((movie) => {

                    return <Card key={movie.id} movie={movie} />
                })
            }

        </section>

        {
            loading ? <p>Cargando...</p> : <Button onClick={addPage}>Ver Más</Button>
        }
    </div>

}


