package com.kh.dolbomi.controller;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rag")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RAGController {

    @Autowired
    private ChatModel chatModel;

    //텍스트를 백터(숫자 배열)로 변환하는 모델
    //gpt의 text-embedding-ada-002, text-embedding-3-small등을 사용해서
    //의미적으로 유사한 텍스트는 유사한 백터로 변환을 시키는 모델
    @Autowired
    private EmbeddingModel embeddingModel;

    /*
    SpringAI의 vectorStore 인터페이스를 구현한 인메모리 벡터 스토어.
    문서를 백터로 변환하여 메모리에 저장하고, 유사도 검색을 수행
     */


    private VectorStore vectorStore;

    //    @PostConstruct : 빈이 생성되고 의존성주입이 끝난 후에 자동으로 실행되는 초기화 메서드
    @PostConstruct
    public void init() {

        try {
            // pdf문서를 백터데이터베이스에 임베딩
            PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(new ClassPathResource("dolbomi_guide.pdf"));
            List<Document> documents = pdfReader.get();
            this.vectorStore = SimpleVectorStore.builder(embeddingModel).build();
            vectorStore.add(documents);
            System.out.println("PDF 임베딩 완료");
        } catch (Exception e) {
            System.out.println("PDF 임베딩 실패");
        }

    }

    @PostMapping("/ask")
    public Map<String, Object> ask(@RequestBody Map<String, String> requset) {
        Map<String, Object> response = new HashMap<>();

        try {
            String question = requset.get("question");
            if (question == null || question.trim().isEmpty()) {
                response.put("status", "error");
                response.put("error", "질문을 입력해주세요.");
                return response;
            }

            //백터 데이터베이스에서 질문과 유사한 문서 검색
            SearchRequest searchRequest = SearchRequest.builder()
                    .query(question)
                    .topK(3)
                    .build();

            List<Document> similarDocs = vectorStore.similaritySearch(searchRequest);

            if (similarDocs.isEmpty()) {
                response.put("status", "error");
                response.put("error", "관련된 답변을 알 수 없습니다.");
                return response;
            }

            //검색된 문서들을 하나의 컨텍스트로 결합
            StringBuilder content = new StringBuilder();
            for (Document doc : similarDocs) {
                content.append(doc.getFormattedContent()).append("\n\n");
            }
            String context = content.toString().trim();

            //GPT에게 전달하여 답변을 생성
            ChatClient chatClient = ChatClient.builder(chatModel).build();

            String prompt = """
                    다음 돌봄이 이용 가이드 문서를 참고해서 질문에 답변해줘.
                    문서에 없는 내용은 '해당정보는 1:1문의에 문의 부탁드립니다'라고 답변해줘.
                    \n
                    [문서내용]
                    
                    """ + context + "\n\n[질문]\n" + question;

            String answer = chatClient.prompt(prompt).call().content();
            response.put("status", "success");
            response.put("answer", answer);
            response.put("context", context);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("error", e.getMessage());
        }
        return response;
    }
}
