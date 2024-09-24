import { motion } from "framer-motion";

export default function LoadingSpinner() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-spinner">
            {/* Add spinner design here */}
        </motion.div>
    );
}
