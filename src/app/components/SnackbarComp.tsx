'use client'
import React from 'react'
import { Alert, Snackbar } from '@mui/material'

type snackDataType = {
    succesSBOpen: boolean,
    errorSBOpen: boolean,
    infoSBOpen?: boolean,
    snackbarMSG: string,
    infoMSG?: string,
    onClose: () => void
}

function SnackbarComp({
    succesSBOpen,
    errorSBOpen,
    infoSBOpen = false,
    snackbarMSG,
    infoMSG = '',
    onClose
}: snackDataType) {

    return (
        <>
            <Snackbar
                open={succesSBOpen}
                autoHideDuration={4000}
                onClose={onClose}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMSG}
                </Alert>
            </Snackbar>
            <Snackbar
                open={errorSBOpen}
                autoHideDuration={4000}
                onClose={onClose}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMSG}
                </Alert>
            </Snackbar>
            <Snackbar
                open={infoSBOpen}
                autoHideDuration={6000}
                onClose={onClose}
            >
                <Alert
                    severity="info"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {infoMSG || snackbarMSG}
                </Alert>
            </Snackbar>
        </>
    )
}

export default SnackbarComp 