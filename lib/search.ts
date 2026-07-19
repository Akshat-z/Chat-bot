import {cosineDistance, desc, gt, sql} from "drizzle-orm"
import {db} from "./db-config"
import {documents} from "./db-schema"
import {generateEmbedding} from "./embedding"

export async function searchDocuments(query: string, topK: number = 5, threshold: number = 0.5) {
    // threshold => min cosine similarity score to consider a document relevant
    const queryEmbedding = await generateEmbedding(query);
    /*cosine similarity = 1 - cosine distance [use in recommendation systems] 
    where similarity is Cos(0) angle between two vectors and distance is the angle between them.
    Cosine similarity ranges from -1 to 1, where 1 means the vectors are identical, 0 means they are orthogonal (no similarity), and -1 means they are diametrically opposed.
    In this case, we want to find documents that are similar to the query, so we use cosine distance to measure how far apart the vectors are. 
    A lower cosine distance indicates higher similarity. We filter out documents with a cosine distance greater than (1 - threshold) to ensure we only get relevant results.
    */
   const similarity = sql<number>`1 - (${cosineDistance(documents.embedding, queryEmbedding)})`;
    const results = await db.select({
        id: documents.id,
        content: documents.content,
        similarity: similarity,
    }).from(documents)
        .where(gt(similarity, threshold)) // Filter out documents with similarity greater than the threshold
        .orderBy(desc(similarity))
        .limit(topK); 
        
    return results;
}