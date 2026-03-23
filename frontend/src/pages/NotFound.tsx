import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NNButton } from '@components/ui/NNButton'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="nn-label text-nn-tertiary mb-6">Error 404</p>
        <h1 className="text-[8rem] md:text-[12rem] font-bold leading-none nn-gradient-text mb-4">
          404
        </h1>
        <h2 className="nn-headline text-nn-on-surface mb-4">Latent Space Not Found</h2>
        <p className="text-nn-on-surface-variant mb-10 max-w-md mx-auto">
          The neural pathway you're looking for doesn't exist in this dimension.
          Perhaps it was pruned during optimization.
        </p>
        <Link to="/">
          <NNButton size="lg">Return to Origin</NNButton>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
