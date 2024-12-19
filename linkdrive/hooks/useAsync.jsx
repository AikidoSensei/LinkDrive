import { useState } from 'react'
	// const { toast } = useToast()

const useAsync = (asyncFunction) => {
	const [success, setSuccess] = useState(true) // Success state (data)
	const [loading, setLoading] = useState(false) // Loading state
	const [error, setError] = useState(null) // Error state

	const execute = async (...args) => {

		setLoading(true)
		setError(null)
		setSuccess(false)
		try {
			const result = await asyncFunction(...args)
			setSuccess(true)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return { success, loading, error, execute }
}

export default useAsync
