import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore();

export const checkCommented = async (court_id, user_id) => {
    try {
        const commentsQuery = query(
            collection(db, "Comment"),
            where("court_id", "==", court_id),
            where("user_id", "==", user_id)
        );

        const querySnapshot = await getDocs(commentsQuery);


        if (!querySnapshot.empty) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error checking comment:", error);
        return false;
    }
};

export const handleDeleteComment = async (commentId) => {
    try {
        const commentRef = doc(db, "Comment", commentId);
        await deleteDoc(commentRef);
        alert("Comment deleted successfully!");

    } catch (error) {
        console.error("Error deleting comment: ", error);
        alert("Failed to delete comment.");
    }
};