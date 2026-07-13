"use server";

import { chunkText } from '@/lib/chunking';
import { db } from '@/lib/db-config';
import { documents } from '@/lib/db-schema';
import { generateEmbeddings } from '@/lib/embedding';
import { PDFParse } from 'pdf-parse';
import {success} from "zod/v4";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    if (!file) {
      return {
        success: false,
        message: "No file provided",
      };
      }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const parser = new PDFParse({
        data: buffer,
    });
    const data = await parser.getText();

    if (!data || data.text.trim() === "") {
        return {
            success: false,
            message: "Failed to extract text from PDF",
        };
    }
    const chanks = await chunkText(data.text);
    const embeddings = await generateEmbeddings(chanks);
    const records = chanks.map((chunk, index) => ({
        content: chunk,
        embedding: embeddings[index],
    }));
    
  await db.insert(documents).values(records);   

    return {
        success: true,
        message: `File processed successfully with ${records.length} chunks`
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      message: "An error occurred while processing the file",
    };
  }
}