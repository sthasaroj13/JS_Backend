import React from 'react'

export default function Login() {
  const onSubmitHandler = (e) =>{
e.preventDefault()
  }
  return (
    <div>
      <form action="" onClick={onSubmitHandler}>
      <div className="container">
      <div className="main">
        <label htmlFor="">Username : </label>
        <input type="text" /> <br /> <br />
        <label htmlFor="">Email : </label>
        <input type="text" /> <br /> <br />
        <label htmlFor="">Password : </label>
        <input type="text" /> <br /> <br />
        <label htmlFor="">fullName : </label>
        <input type="text" /> <br /> <br />
        <label htmlFor="">Avatar : </label>
        <input type="file" /> <br /> <br />

        <button type='submit'>Submit</button>
      </div>
      
      

      </div>
      </form>
    </div>
  )
}
