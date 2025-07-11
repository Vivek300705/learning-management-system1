import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SearchBar from '../../student/SearchBar';

function CourseList() {
  const navigate = useNavigate();
  const input =useParams();
  return (
    <>
      <div>
        <div className='relative md:px-36 px-8 pt-20 te'>
        <div>
          <h1>Course List</h1>
          <p className='text-gray-500'><span className='text-blue-600 cursor-pointer' onClick={()=>navigate('/')}>Home </span>/<span> Course List</span></p>
        </div>
          <SearchBar data={input} />
        </div>
      </div>
    </>
  )
}

export default CourseList