import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { UserAuth } from '../context/AuthContext'
import { db } from '../firebase'
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'

const Movie = ({ movie }) => {
  const [like, setLike] = useState(false)
  const { user } = UserAuth()

  useEffect(() => {
    const checkSavedShows = async () => {
      if (user?.email) {
        const movieDoc = doc(db, 'users', user.email)
        const movieSnapshot = await getDoc(movieDoc)
        if (movieSnapshot.exists()) {
          const savedShows = movieSnapshot.data().savedShows || []
          const isSaved = savedShows.some((show) => show.id === movie.id)
          setLike(isSaved)
        }
      }
    }

    checkSavedShows()
  }, [user, movie.id])

  const saveShow = async () => {
    if (user?.email) {
      const movieID = doc(db, 'users', user.email)

      setLike(!like)

      await updateDoc(movieID, {
        savedShows: like
          ? arrayRemove({ id: movie.id })
          : arrayUnion({
              id: movie.id,
              title: movie.title,
              img: movie.backdrop_path,
            }),
      })
    } else {
      alert('Please log in to save a movie')
    }
  }

  return (
    <div className='w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2'>
      <img
        className='w-full h-auto block'
        src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`}
        alt={movie?.title}
      />
      <div className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white'>
        <p className='whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full'>
          {movie?.title}
        </p>

        <p onClick={saveShow}>
          {like ? (
            <FaHeart className='absolute top-4 left-4 text-gray-300' />
          ) : (
            <FaRegHeart className='absolute top-4 left-4 text-gray-300' />
          )}
        </p>
      </div>
    </div>
  )
}

export default Movie
