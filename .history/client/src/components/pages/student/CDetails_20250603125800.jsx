import React from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../../context/AppContext'
function CDetails() {
  const {id}=useParams();
  const [course, setCourse] = React.useState(null);
  const {allCourses} = React.useContext(AppContext);
  const fetchCourseDetails = () => {
    const foundCourse = allCourses.find(course => course._id === id);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      console.error('Course not found');
    }

  };
  React.useEffect(() => {
    fetchCourseDetails();
  }, []);
  return (
    <div>
      {/* left Column */}
      <
      {/* right Column */}

    </div>
  )
}

export default CDetails