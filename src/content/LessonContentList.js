import React, { useState, useEffect } from 'react'
import { Card, List, Spin, Empty, Button, Space } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { getContentsByLesson, deleteContent } from '../service/remote'
import AddContent from './AddContent'

export default function LessonContentList() {
  let location = useLocation()
  const id = location.state.data.id

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    getContentsByLesson(id).then(resp => {
      setItems(resp.data)
      setLoading(false)
    })
  }, [id])

  function _fetchData() {
    getContentsByLesson(id).then(resp => {
      setItems(resp.data)
      setLoading(false)
    })
  }

  return (
    loading
      ? <div style={{ textAlign: 'center', margin: '50px', padding: '50px' }}>
        <Spin />
      </div>
      : <>
        <Card
          title={location.state.data.title}
          extra={<AddContent onAdded={() => _fetchData()}
            lessonID={id} />}
        >
          {
            items.length !== 0 ?

              (
                <List>
                  {items.map(i =>
                    <React.Fragment key={i.id}>
                      <List.Item
                        extra={<Button danger size="small" onClick={() => {
                          deleteContent(i.id).then(() => _fetchData())
                        }}>
                          Delete</Button>}>
                        <Link to={{ pathname: `${location.pathname}/${i.id}`, state: { data: i } }}>
                          {i.title}
                        </Link>
                      </List.Item>
                    </React.Fragment>)}
                </List>
              )
              :
              <Empty />
          }
        </Card>
      </>
  )
}