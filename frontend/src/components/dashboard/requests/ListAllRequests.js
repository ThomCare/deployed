import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Button, ButtonGroup, ButtonToolbar, Row, Col } from 'react-bootstrap'
import { MDBDataTableV5 } from 'mdbreact'
import { getRequests, clearErrors } from '../../../actions/requestActions'
import { INSIDE_DASHBOARD_TRUE } from '../../../constants/dashboardConstants'
import Sidebar from '../../layout/Sidebar'
import MetaData from '../../layout/MetaData'
import Loader from '../../layout/Loader'
import dateformat from 'dateformat'

const ListAllRequests = ({ history }) => {

    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, requests, pending, processing, approved, denied, error } = useSelector(state => state.requests)

    const [requestList, setRequestList] = useState([])
    const [status, setStatus] = useState('Requests')
    const [searchButton, setSearchButton] = useState(1)
    const [filter, setFilter] = useState({
        requestType: ''
    })
    const requestTypes = [
        'Adding/Dropping of Course',
        'Cross Enrollment within CICS',
        'Cross Enrollment outside CICS',
        'Request for Petition Classes within CICS',
        'Request for Crediting of Courses',
        'Request for Overload',
        'Request to Override',
        'Request for Late Enrollment',
        'Request for Manual Enrollment',
        'Request for Course Description',
        'Request for Certificate of Grades',
        'Request for Leave of Absence',
        'Submission of Admission Memo',
        'Others'
    ]

    const { requestType } = filter

    const changeDateFormat = (date) => dateformat(date, "mmm d, yyyy h:MMtt")
    const upperCase = (text) => text.toUpperCase()

    useEffect(() => {
        setRequestList([])

        switch (status) {
            case 'Requests':
                setRequestList(requests)
                break
            case 'Pending':
                setRequestList(pending)
                break
            case 'Processing':
                setRequestList(processing)
                break
            case 'Approved':
                setRequestList(approved)
                break
            case 'Denied':
                setRequestList(denied)
                break
            default:
                break
        }

    }, [status, requests, pending, processing, approved, denied])

    useEffect(() => {
        dispatch(getRequests('CICS Office', 'All'))

        if (error) {
            alert.error(error)
            dispatch(clearErrors())

            history.push('/error')
        }

        dispatch({
            type: INSIDE_DASHBOARD_TRUE
        })
    }, [dispatch, history, alert, error])

    const setRequests = () => {
        const data = {
            columns: [
                {
                    label: 'Date',
                    field: 'date',
                    width: 120
                },
                {
                    label: 'Request Type',
                    field: 'requestType',
                    width: 300
                },
                {
                    label: 'Requested by',
                    field: 'name',
                    width: 280
                },
                {
                    label: 'Status',
                    field: 'requestStatus',
                    width: 150
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 150
                }
            ],
            rows: []
        }

        requestList && requestList.forEach(request => {
            const viewType = '5' + request._id

            data.rows.push({
                date: changeDateFormat(request.createdAt),
                requestType: request.requestType,
                name: request.requestorInfo.firstName + ' ' + request.requestorInfo.lastName,
                requestStatus: <Fragment>
                    <p style={{
                        color: request.requestStatus === 'Pending' ? 'blue' : (
                            request.requestStatus === 'Processing' ? '#ffcc00' : (
                                request.requestStatus === 'Denied' ? 'red' : 'green'
                            )
                        )
                    }}>
                        {upperCase(request.requestStatus)}
                    </p>
                </Fragment>,
                actions: <Fragment>
                    <Link to={`/view/request/${viewType}`}>
                        <Button variant="primary" className="mr-5" style={{ margin: '5px' }}>
                            <i class="fa fa-eye" aria-hidden="true" style={{ textDecoration: 'none', color: 'white' }} />
                        </Button>
                    </Link>
                </Fragment>
            })
        })

        return data
    }

    return (
        <Fragment>
            <MetaData title={'All Requests'} />
            <Sidebar />
            <div className="row">
                <div className="">
                    <Container fluid style={{ padding: "50px 0px" }}>
                        <Row style={{ margin: '30px 0 20px 0' }}>
                            <Col xs={12} sm={4}>
                                <h3>All Requests</h3>
                                <h6 className='text-muted'>{`${status}`}</h6>
                            </Col>
                            <Col xs={12} sm={8}>
                                <ButtonToolbar style={{ margin: '2px' }}>
                                    <ButtonGroup className="mr-2">
                                        <Button variant="outline-secondary" onClick={() => setStatus('Requests')}>View All</Button>
                                        <Button variant="outline-secondary" onClick={() => setStatus('Pending')}>Pending</Button>
                                        <Button variant="outline-secondary" onClick={() => setStatus('Processing')}>Processing</Button>
                                        <Button variant="outline-secondary" onClick={() => setStatus('Approved')}>Approved</Button>
                                        <Button variant="outline-secondary" onClick={() => setStatus('Denied')}>Denied</Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                        {loading ? <Loader /> : (
                            <>
                                <MDBDataTableV5
                                    data={setRequests()}
                                    searchTop
                                    searchBottom={false}
                                    scrollX
                                    entriesOptions={[10, 20, 30, 40, 50]}
                                    entries={10}
                                />
                            </>
                        )}
                    </Container>
                </div>
            </div>
        </Fragment>
    )
}

export default ListAllRequests