import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000/api'

function StarRating({ value, onChange, size = 'text-xl' }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`${size} transition-colors ${(hovered || value) >= star ? 'text-yellow-500' : 'text-gray-700'} ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ productId }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fetchReviews = async () => {
    setLoading(true)
    const res = await fetch(`${API}/reviews/${productId}`)
    const data = await res.json()
    setReviews(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [productId])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const hasReviewed = user && reviews.some(r => r.userId === user.id)

  const handleSubmit = async () => {
    if (!rating) return setError('Please select a star rating')
    if (!comment.trim()) return setError('Please write a comment')
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating, comment })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSuccess(true)
      setRating(0)
      setComment('')
      await fetchReviews()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId) => {
    await fetch(`${API}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    await fetchReviews()
  }

  return (
    <div className="mt-16 border-t border-white/5 pt-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-2">Customer Reviews</p>
          <h3 className="font-serif text-2xl text-white">
            {reviews.length === 0 ? 'No Reviews Yet' : `${reviews.length} Review${reviews.length > 1 ? 's' : ''}`}
          </h3>
        </div>
        {avgRating && (
          <div className="text-right">
            <p className="font-serif text-4xl text-yellow-500">{avgRating}</p>
            <StarRating value={Math.round(avgRating)} size="text-base" />
            <p className="text-gray-600 text-xs mt-1">out of 5</p>
          </div>
        )}
      </div>

      {/* Write a review */}
      <div className="bg-[#111] border border-white/5 p-6 mb-8">
        <h4 className="text-white text-sm tracking-widest uppercase mb-4">Write a Review</h4>
        {!user ? (
          <div className="flex items-center gap-4">
            <p className="text-gray-500 text-sm">Sign in to leave a review.</p>
            <button onClick={() => navigate('/auth')} className="text-xs tracking-widest uppercase text-yellow-600 border border-yellow-700/30 px-4 py-2 hover:bg-yellow-600/10 transition-all">
              Sign In
            </button>
          </div>
        ) : hasReviewed ? (
          <p className="text-gray-500 text-sm">You have already reviewed this product.</p>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Your Rating</p>
              <StarRating value={rating} onChange={setRating} size="text-2xl" />
            </div>
            <div className="mb-4">
              <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Your Review</p>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience with this product..."
                className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-yellow-700/50 placeholder-gray-700 resize-none transition-colors"
              />
            </div>
            <AnimatePresence>
              {error && <motion.p className="text-red-400 text-xs mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{error}</motion.p>}
              {success && <motion.p className="text-green-400 text-xs mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>✓ Review submitted!</motion.p>}
            </AnimatePresence>
            <motion.button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-yellow-600 text-black text-xs font-semibold tracking-[0.25em] uppercase hover:bg-yellow-500 transition-all disabled:opacity-40"
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </motion.button>
          </div>
        )}
      </div>

      {/* Reviews list */}
      {loading ? (
        <p className="text-gray-600 text-sm">Loading reviews...</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                className="bg-[#111] border border-white/5 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-600/10 border border-yellow-700/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-600 text-xs font-semibold">{review.userName[0]}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm">{review.userName}</p>
                      <p className="text-gray-600 text-xs">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating value={review.rating} size="text-sm" />
                    {(user?.id === review.userId || user?.isAdmin) && (
                      <button onClick={() => handleDelete(review.id)} className="text-gray-700 hover:text-red-400 text-xs transition-colors">
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}