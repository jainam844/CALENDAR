import {
  Wrapper,
  CalenderHead,
  SevenColGrid,
  HeadDay,
  CalenderBody,
  StyledDay,
  StyledEvent
} from './styled'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as Icon from 'react-bootstrap-icons'
import { Days, MONTHS } from './const'
import {
  range,
  getDaysInMonth,
  getSortedDays,
  areDatesTheSame,
  getDateobj
} from './util'
import { useState, useEffect } from 'react'
import { EventModal } from './addEventModal/addEventModal'
import './addEventModal/addEventModal.css'

export const Calender = ({
  startingDate,
  eventsArr,
  addEvent,
  editEvent,
  removeEvent
}) => {
  const [currentMonth, setCurrentMonth] = useState(startingDate.getMonth())
  const [currentYear, setCurrentYear] = useState(startingDate.getFullYear())
  const DaysInMonth = getDaysInMonth(currentMonth, currentYear)
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventForm, setEventForm] = useState({})

  const [showDeleteButton, setShowDeleteButton] = useState(false)

  const [Modal, setModal] = useState(false)

  const toggelModal = () => {
    setModal(!Modal)
  }

  const nextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth(prev => prev + 1)
    } else {
      setCurrentMonth(0)
      setCurrentYear(prev => prev + 1)
    }
  }

  const prevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(prev => prev - 1)
    } else {
      setCurrentMonth(11)
      setCurrentYear(prev => prev - 1)
    }
  }

  const loadData = thisevent => {
    const eventOnDay = eventsArr.find(
      event =>
        event.title === thisevent.title &&
        event.date === thisevent.date &&
        event.reminderTime === thisevent.reminderTime
    )
    setEventForm(eventOnDay || null)
    setSelectedEvent(eventOnDay || null)
  }

  const onAddEditEvent = (event, data, selectedDay) => {
    event.preventDefault()
    if (selectedEvent) {
      editEvent(selectedEvent, data)
      setSelectedEvent(null)
    } else {
      addEvent(data, selectedDay)
    }
    toggelModal()
    setEventForm(null)
  }

  const onRemoveEvent = eventToBeDel => {
    removeEvent(eventToBeDel)
    toggelModal()
    setEventForm(null)
    setSelectedEvent(null)
  }

  return (
    <Wrapper>
      <CalenderHead>
        <Icon.ArrowLeftCircleFill onClick={prevMonth} />
        <p className='m-0'>
          {MONTHS[currentMonth]} {currentYear}
        </p>
        <Icon.ArrowRightCircleFill onClick={nextMonth} />
      </CalenderHead>
      <SevenColGrid>
        {getSortedDays(currentMonth, currentYear).map(day => (
          <HeadDay>{day}</HeadDay>
        ))}
      </SevenColGrid>
      <CalenderBody fourCol={DaysInMonth === 28}>
        {range(DaysInMonth).map(day => {
          const dateObj = getDateobj(day, currentMonth, currentYear)
          const isCurrentDate = areDatesTheSame(new Date(), dateObj)
          const eventsOnDate = eventsArr.filter(event =>
            areDatesTheSame(dateObj, event.date)
          )
          return (
            <>
              <StyledDay
                onClick={e => {
                  setSelectedDay(getDateobj(day, currentMonth, currentYear))
                  setEventForm(null)
                  setShowDeleteButton(false)
                  setSelectedEvent(null) // Clear the selectedEvent state for new events
                  toggelModal()
                }}
                active={areDatesTheSame(
                  new Date(),
                  getDateobj(day, currentMonth, currentYear)
                )}
              >
                <p>{day}</p>
                {eventsArr.map(
                  event =>
                    areDatesTheSame(
                      getDateobj(day, currentMonth, currentYear),
                      event.date
                    ) && (
                      <StyledEvent>
                        <span
                          className='w-100 text-start'
                          type='button'
                          onClick={e => {
                            e.stopPropagation()
                            loadData(event)
                            setShowDeleteButton(true)
                            toggelModal()
                          }}
                        >
                          {event.title}
                        </span>
                      </StyledEvent>
                    )
                )}
              </StyledDay>
              {Modal && (
                <div className='modal'>
                  <div onClick={toggelModal} className='overlay'>
                    <div
                      className='modal-content'
                      onClick={e => e.stopPropagation()}
                    >
                      <h4 className='form-heading'>
                        {selectedEvent ? 'Edit Event' : 'Add Event'}
                      </h4>

                      <button
                        type='button'
                        className='close-btn'
                        onClick={toggelModal}
                      >
                        <Icon.XLg />
                      </button>

                      <form>
                        <div className='form-group mb-3'>
                          <h4>
                            {' '}
                            <label className='form-label'>Title</label>
                          </h4>
                          <input
                            type='text'
                            className='form-control'
                            value={eventForm?.title || ''}
                            onChange={e =>
                              setEventForm({
                                ...eventForm,
                                title: e.target.value
                              })
                            }
                          />
                        </div>
                        {/* ... */}
                        <div className='d-flex justify-content-end'>
                          <button
                            className='save-event'
                            disabled={!eventForm?.title} // Disable the button if the title is not filled
                            style={{ opacity: eventForm?.title ? 1 : 0.5, cursor: eventForm?.title ? 'pointer' : 'not-allowed' }}
                            onClick={e => {
                              e.stopPropagation()
                              onAddEditEvent(e, eventForm, selectedDay)
                            }}
                          >
                            Save
                          </button>

                          {showDeleteButton && (
                            <button
                              className='delete-btn'
                              onClick={e => {
                                e.stopPropagation()
                                onRemoveEvent(eventForm)
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        })}
      </CalenderBody>
    </Wrapper>
  )
}
