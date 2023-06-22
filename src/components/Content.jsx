import { useEffect, useRef, useState } from 'react'

const api = 'http://localhost:8080/api/todoapp'

const Content = () => {
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [works, setWorks] = useState([])
  const inputElement = useRef()
  const elementAll = useRef()
  const elementActive = useRef()
  const elementComplete = useRef()
  const searchElement = useRef()
  const [select, setSelect] = useState('All')

  useEffect(() => {
    fetch(api)
      .then((response) => response.json())
      .then((value) => setWorks(value))
  }, [])

  const handleChangeInput = (e) => {
    if (e.key === 'Enter') {
      handleAddWork()
    }
  }

  const handleAddWork = () => {
    if (input.trim() !== '') {
      var option = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: input,
        }),
      }

      fetch(api, option)
        .then((response) => response.json())
        .then(
          (value) =>
            (select === 'All' || select === 'Active') &&
            value.title.toLowerCase().includes(search.trim().toLowerCase()) &&
            setWorks((pre) => {
              return [
                ...pre,
                {
                  id: value.id,
                  title: value.title,
                  status: value.status,
                },
              ]
            })
        )
    }
    setInput('')
    inputElement.current.focus()
  }

  const handleSearchWork = (e) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    fetch(api)
      .then((response) => response.json())
      .then((value) =>
        setWorks(() => {
          var res = value.filter((i) => {
            if (select === 'All') {
              return i.title
                .toLowerCase()
                .includes(search.trim().toLowerCase())
            }
            return (
              i.status === select.toUpperCase() &&
              i.title.toLowerCase().includes(search.trim().toLowerCase())
            )
          })

          return res
        })
      )
  }, [search, select])

  const handleChangeCheckbox = (id, e) => {
    var option = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: works.find((i) => i.id === id).title,
        status: e.target.checked ? 'COMPLETE' : 'ACTIVE',
      }),
    }

    fetch(api + `/${id}`, option)
      .then((response) => response.json())
      .then((value) =>
        setWorks((pre) => {
          pre = pre.map((e) => {
            if (e.id === value.id) {
              e.status = value.status
            }

            return e
          })

          return [...pre]
        })
      )
  }

  const handleRemoveWork = (id) => {
    var option = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    fetch(api + `/${id}`, option)
      .then((response) => response.json())
      .then((value) =>
        setWorks((pre) => {
          pre.splice(
            pre.findIndex((i) => i.id === id),
            1
          )

          return [...pre]
        })
      )
  }

  useEffect(() => {
    var classNameAll = elementAll.current.className.split(' ')
    var classNameActive = elementActive.current.className.split(' ')
    var classNameComplete = elementComplete.current.className.split(' ')

    if (select === 'All') {
      classNameAll.splice(classNameAll.findIndex((i) => i === 'button-select'))
      elementAll.current.className = classNameAll.join()
      elementActive.current.className =
        elementActive.current.className + ' button-select'
      elementComplete.current.className =
        elementComplete.current.className + ' button-select'
    } else if (select === 'Active') {
      classNameActive.splice(
        classNameActive.findIndex((i) => i === 'button-select')
      )
      elementActive.current.className = classNameActive.join()
      elementAll.current.className =
        elementAll.current.className + ' button-select'
      elementComplete.current.className =
        elementComplete.current.className + ' button-select'
    } else if (select === 'Complete') {
      classNameComplete.splice(
        classNameComplete.findIndex((i) => i === 'button-select')
      )
      elementComplete.current.className = classNameComplete.join()
      elementActive.current.className =
        elementActive.current.className + ' button-select'
      elementAll.current.className =
        elementAll.current.className + ' button-select'
    }
  }, [select])

  const handleClickSearch = () => {
    searchElement.current.focus()
  }

  return (
    <div className='Content'>
      <input
        className='input_work'
        placeholder='Add New'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => handleChangeInput(e)}
        ref={inputElement}
      />
      <div className='show-content'>
        {works.map((e, i) => (
          <div key={i} id={`work-${e.id}`} className='work'>
            <input
              type='checkbox'
              checked={e.status === 'COMPLETE'}
              onChange={(e1) => handleChangeCheckbox(e.id, e1)}
            />
            <span
              className={
                e.status !== 'ACTIVE'
                  ? 'title-content-completed'
                  : 'title-content'
              }
            >
              {e.title}
            </span>
            <svg
              className='remove-work'
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='11'
              height='11'
              viewBox='0 0 24 24'
              onClick={() => handleRemoveWork(e.id)}
            >
              <path d='M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z'></path>
            </svg>
          </div>
        ))}
      </div>
      <div className='menu'>
        <div className='add'>
          <i className='fas fa-plus' onClick={handleAddWork}></i>
        </div>
        <div className='search'>
          <i className='fas fa-search' onClick={handleClickSearch}></i>
        </div>
        <div className='div-search'>
          <input
            className='input-search'
            ref={searchElement}
            value={search}
            type='text'
            placeholder='Search Work'
            onChange={(e) => handleSearchWork(e)}
          />
        </div>
        <div className='length_work_1'>
          <div className='length_work_2'>{works.length} items</div>
        </div>
        <div className='flex'>
          <div className='list-div'>
            <div className='div-button-all'>
              <button
                ref={elementAll}
                className='button-all button-select'
                onClick={() => setSelect('All')}
                // onClick={handleClickAll}
              >
                All
              </button>
            </div>
            <div className='div-button-active'>
              <button
                ref={elementActive}
                className='button-active button-select'
                onClick={() => setSelect('Active')}
                // onClick={handleClickActive}
              >
                Active
              </button>
            </div>
            <div className='div-button-complete'>
              <button
                ref={elementComplete}
                className='button-complete button-select'
                onClick={() => setSelect('Complete')}
                // onClick={handleClickComplete}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content
