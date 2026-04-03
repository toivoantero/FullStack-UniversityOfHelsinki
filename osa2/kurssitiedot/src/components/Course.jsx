const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    )
}

const Part = (props) => {
    return (
        <div>
            <p>
                {props.title} {props.exercises}
            </p>
        </div>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part
                    key={part.id}
                    title={part.name}
                    exercises={part.exercises}
                />
            )}
        </div>
    )
}

const Total = ({ parts }) => {
    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>
                Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
            </p>
        </div>
    )
}

const Course = ({ courses }) => {
    return (
        <div>
            {courses.map(course => (
                <div key={course.id}>
                    <Header course={course.name} />
                    <Content parts={course.parts} />
                    <Total parts={course.parts} />
                </div>
            ))}
        </div>
    )
}

export default Course