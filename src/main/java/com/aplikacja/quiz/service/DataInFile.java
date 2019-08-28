package com.aplikacja.quiz.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
@Service
public class DataInFile {
    private final static String DELIMITER = "'";

    public List<String[]> getData(String filePath) {
        BufferedReader bufferedReader = createDataBuffer(filePath);
        List<String []> dataList = new ArrayList<>();
        String line;
        String [] token;

        try {
            while ((line = bufferedReader.readLine()) != null) {
                token = line.split(DELIMITER);
                dataList.add(token);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            closeDataBuffer(bufferedReader);
        }
        return dataList;
    }

     BufferedReader createDataBuffer(String filePath) {
        BufferedReader bufferedReader = null;

        try {
            FileReader fileReader = new FileReader(filePath);
            bufferedReader = new BufferedReader(fileReader);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return bufferedReader;
    }

     void closeDataBuffer(BufferedReader bufferedReader) {
        if (bufferedReader != null) {
            try {
                bufferedReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
