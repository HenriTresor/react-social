import React, { useContext, useReducer, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
    Button, Box
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { AppData } from '../context/AppContext'
import { serverLink } from '../utils/links'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCHING':
            return { ...state, loading: true }
            break;
        case 'FETCHED':
            return { ...state, loading: false, res: action.payload }
            break;
        case 'ERROR': {
            return { ...state, loading: false, error: true, res: action.payload }
        }
    }
}
const NewPageDialog = ({ pageModalOpen, setPageModalOpen, setGlobalSnackBarMsg, setGlobalSnackBarOpen }) => {
    const [{ loading, error, res }, dispatch] = useReducer(reducer, {
        res: '',
        loading: false,
        error: false
    })
    const [inputValues, setInputValues] = useState({
        page_category: '',
        page_name: ''
    })

    const handleChange = (e) => {
        setInputValues(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    const { currentUser } = useContext(AppData)
    const handleClose = () => {
        setPageModalOpen(false)
    }


    const createPage = async () => {
        try {
            dispatch({ type: 'FETCHING' })
            const response = await fetch(`${serverLink}/pages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...inputValues, page_admin:currentUser?._id})
            })
            let data = await response.json()
            console.log(data);
            if (!data.status) {
                dispatch({ type: 'ERROR' })
            }
            dispatch({ type: 'FETCHED', payload: data?.message })
            setGlobalSnackBarOpen(true)
            setGlobalSnackBarMsg(data?.message)
        } catch (err) {
            setGlobalSnackBarOpen(true)
            setGlobalSnackBarMsg(err?.message)
            console.log(err.message);
            dispatch({ type: 'ERROR', payload: err?.message })
        }
    }
    return (
        <Dialog
            open={pageModalOpen}
        >
            <DialogTitle>
                Create a new page
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    fill in the form to create a page for your organisation
                </DialogContentText>
                <DialogActions
                    sx={{
                        marginTop: 4,
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            marginBottom: 3
                        }}
                    >
                        <TextField
                            onChange={(e) => handleChange(e)}
                            fullWidth
                            value={inputValues.page_name}
                            variant='standard'
                            name='page_name'
                            label='organisation name'

                        />
                        <TextField
                            fullWidth
                            value={inputValues.page_category}
                            variant='standard'
                            onChange={(e) => handleChange(e)}
                            label='category'
                            name='page_category'

                        />
                    </Box>
                    <Box>
                        <Button
                            color='warning'
                            variant='outlined'
                            onClick={handleClose}
                        >
                            cancel
                        </Button>
                        {
                            loading ? (
                                <LoadingButton
                                    loading
                                >
                                    creating page
                                </LoadingButton>
                            ) : (
                                <Button
                                    color='success'
                                    variant='contained'
                                    sx={{
                                        marginLeft: 3
                                    }}
                                    onClick={createPage}
                                >
                                    create page
                                </Button>
                            )
                        }
                    </Box>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

export default NewPageDialog