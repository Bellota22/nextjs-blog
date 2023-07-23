---
title: "Chat over documents PDF with OpenAI, Langchain and Qdrant"
date: '2023-07-23'
---
![Langchain image](https://raw.githubusercontent.com/Bellota22/chatbot_qa_langchain/master/images/langchain.png)

[Git hub repository](https://github.com/Bellota22/chatbot_qa_langchain)
## Features

- [Lang Chain](https://python.langchain.com/docs/get_started/introduction.html) Framework for developing applications powered by language models.
- [Google Colab](https://colab.research.google.com/drive/1WJa5fPgZNQoW279QeOG0ssLV-HNaE0ur?usp=sharing)  Project in Google colab
- [Qdrant](https://qdrant.tech/documentation/) Vector database to save our documents PDF
- [OpenAI](https://platform.openai.com/docs/introduction) LLM used in this example, it can be others LLM but this one had better performance

## Review

This project is aimed at building a question and answer (QA) chatbot. The process involves several steps, from the installation and importation of necessary packages to connecting to the OpenAI API for language modeling and the Qdrant platform for vector database management.

## Step 0: Set up

* Install the necessary packages using the following command:


```
!pip install PyPDF2 qdrant_client langchain openai tiktoken sentence_transformers

```

* Import the required packages into your Python script:


```
import os
from PyPDF2 import PdfReader, PdfFileMerger

from langchain import HuggingFaceHub
from langchain.llms import OpenAI
from langchain.schema import retriever
from langchain.chains import RetrievalQA
from langchain.vectorstores import Qdrant
from langchain.prompts import PromptTemplate
from langchain.text_splitter import CharacterTextSplitter

from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.embeddings.openai import OpenAIEmbeddings


from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams


```

* Define API key:

  * Create an account at OpenAI and create an [API key](https://platform.openai.com/account). Note that OpenAI API is not free. You will need to set up billing information there to be able to use OpenAI API. Alternatively, you can use models from HuggingFace Hub or other places.
  * Crete an account at [Qdrant](https://login.cloud.qdrant.io/login?state=hKFo2SBsUld6X3pXMjVMZWFLTlFOUmxtaTB1VzVrSHlJbDUyTKFupWxvZ2luo3RpZNkgTkxWRjdITm5zMUdfX2xvUlEwVVZHRVBrM0NvOXZldHijY2lk2SBySTF3Y09QSE9NZGVIdVR4NHgxa0YwS0ZkUTd3bmV6Zw&client=rI1wcOPHOMdeHuTx4x1kF0KFdQ7wnezg&protocol=oauth2&tokenDialect=access_token_authz&audience=https%3A%2F%2Fcloud.qdrant.com%2Fapi%2Fv1%2Fclusters&redirect_uri=https%3A%2F%2Fcloud.qdrant.io%2Foverview&scope=openid%20profile%20email&response_type=code&response_mode=query&nonce=eENUbzljWDZLMjNZNnBlRXFvRmhaZEdxZnJSbThuTDdqaE5GRWJffmxrZg%3D%3D&code_challenge=XffPc_3hCsNjqjEsEIemsgVpjdqdOvkakTnE3QGckOg&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMS4xMi4xIn0%3D). Then create an API KEY
  * As well we are gonna use [HuggingFace](https://huggingface.co/). Create a writer API KEY

  ```
  os.environ['OPENAI_API_KEY'] = 'your_OPENAI_API_KEY'
  os.environ['HUGGINGFACEHUB_API_TOKEN'] = 'your_HUGGINGFACEHUB_API_TOKEN'
  os.environ['QDRANT_KEY_TOKEN'] = 'your_QDRANT_KEY_TOKEN'
  ```

## Step 1: Defining our database

    * In this project,  we are using [Qdrant](https://qdrant.tech/) as our vectorial database

    After creating an account, the first step is to create a new cluster. You can use different 
    configurations for your cluster. For this example, we will use the free tier cluster and name 
    it 'test'.

![Create Cluster image](https://raw.githubusercontent.com/Bellota22/chatbot_qa_langchain/master/images/create_cluster.png)

    Once you create your cluster, make sure to save your API key in a safe place.

With your cluster ready, the next step is to create a collection where your data will be stored. To achieve this, we need to initialize our Qdrant client. This allows us to communicate with the Qdrant database.

```
def init_client_db(url_db):
client_db = QdrantClient(
    url=url_db,
    api_key = os.getenv("QDRANT_KEY_TOKEN")
)

return client_db
```
    To initialize our client we need to pass it an URL provided by our Qdrant cluster in this case 
    
```

def create_collection(client_db, collection_name, size_length_stored):

    collection_creator = client_db.recreate_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=size_length_stored, distance=Distance.COSINE),
    )
    return True
```

    To create our collection we will need:
        * client_db : Qdrant's client as an object, 
        * collection_name: Name our collection will have
        * size_length_stored: This depend in the embedding model that you will use.
            ex: HuggingFace 768, OpenAI 1536. More info https://huggingface.co/spaces/mteb/leaderboard


    * Then, once we are setted up, lets start uploading our data! 
    The data that we will use as example is a scholarship rulebook from Universidad privada del Norte 

    In order to do this we need to initialize our vectorstore object:

```
def get_vectorstore(client_db, collection_name, embeddings):

    vectorstore = Qdrant(

        client = client_db,
        collection_name = collection_name,
        embeddings= embeddings
    )
    return vectorstore
```
    This function depends on:
    * embeddings: Embedding model to vectorize our information in this case we are 
    gonna use Hugging face embed model
    * client_db
    * collection_name


    In this function we simplified our process to save data into our database
```
def save_vector_data(path_pdf, vectorstore):

    text = pdf_to_text(path_pdf)
    chunks = get_chunks_from_long_text(text)

    print('Uploading data to Qdrant vectorstore!')
    vectorstore.add_texts(chunks)
    print('Uploaded!')

    return True

```

    This function depends on:
    * vectorstore: Object from Qdrant
    * path_pdf

    As well we are using others functions that we will explain above

```
def pdf_to_text(pdf_direction):
    reader =PdfReader(pdf_direction)
    text = ""
    num_pages = len(reader.pages)

    for i in range(num_pages):
        page = reader.pages[i]
        text += page.extract_text()

    return text
```
    First we need to extract the data from the pdf using PyPDF2 library


```

def get_chunks_from_long_text(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )

    chunks = text_splitter.split_text(text)
    return chunks
```
    After we  get the text for the pdf document, we need to split it in chunks of
    1000 with a little overlap to not lose information, we supports in Langchain framework

    We can check our data stored in Qdrant dashboard for this go to your cluster, and select dashboard 
    Another tab will ask you your Qdrant apikey and you will see your collection 
    with the information of the data


## Step 2: Querying

    Once we prepared our data we are gonna connect our OpenAI with our database model
    then we are gonna querying over the docs we uploaded
```
def query_to_db(query, user, llm, vectorstore):

    query_enriched = query_template(query, user)
    response = query_response(llm, vectorstore, query_enriched)

    return response
```

    In this function we can split it into the template we use to querying the LLM
    We want to get the user question and information, and answer based on the documents 
    and de information provided. In this case we are gonna input the user question and
    get a util information for this example

![Langchain image](https://raw.githubusercontent.com/Bellota22/chatbot_qa_langchain/master/images/info_storaged.png)


```
user_1 ={
    'Certificado de discapacidad': True,
    'Carne de discapacidad': True
}
user_2 ={
    'Certificado de discapacidad': False,
    'Carne de discapacidad': True
}

query = '¿Tengo lo mínimo para postular a una beca ?'

```

    With this information we can create our query template using langchain

```
def query_template(query, user):

    prompt_template = PromptTemplate(
        input_variables = ["query", "user"],
        template = "El usuario con la siguiente información: {user} pregunta lo siguiente:
         {query}. Responder en base a la información del usuario "
    )
    query_final = prompt_template.format(query=query,user=user)
    return query_final
```


    Finally when we get our enriched query, we can connect our LLM with langchain and our Qdrant
    database, with this we can ask question over the documents we uploaded and give good anwsers

```
def query_response(llm, vectorstore, query_enriched):
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever= vectorstore.as_retriever(),
        verbose= True,
        return_source_documents=True
    )

    response = qa(query_enriched)
    answer = {
        'result':response['result'],
        'source':  response['source_documents']
    }
    return answer
```

## Results

    To test all this project we can run this function main

```
def main():
    path_pdf = 'beca.pdf'
    url_db = "https://e37ec073-7c8f-4c8b-91b8-961730e98868.us-east-1-0.aws.cloud.qdrant.io"
    collection_name= "test_collection"
    size_length_stored=768  
    query = '¿ Tengo lo mínimo para postular a una beca ?'
    user_1 ={
    'Certificado de discapacidad': True,
    'Carne de discapacidad': True

    }
    embedding = HuggingFaceEmbeddings()
    llm= OpenAI()


    
    vectorstore =vectorstore_save_data(url_db, collection_name, size_length_stored, embedding, path_pdf)

    response = query_to_db(query, user_1, llm, vectorstore)

    return response
```

```

Uploading data to Qdrant vectorstore!
Uploaded!

> Entering new RetrievalQA chain...

> Finished chain.
{'result': ' Sí, con los documentos mencionados en el Anexo 05 tienes los requisitos 
mínimos para postular a una Beca Inclusión.', 'source': [Document(page_cont  . . .,  metadata={})]}
```

    Testing with user_2 with the following answer

```
> Finished chain.
{'result': ' No, para postular a una beca necesitas presentar el Certificado de Discapacidad 
emitido por el establecimiento de salud del Ministerio de Salud (MINSA)
 además del Carné de Discapacidad emitido por CONADIS.',
 'source': [Document(page_content='documento . . . metadata={})]}

```

    As we can see, in based of the information provided from the user_1 and user_2 and the information
    uploaded to Qdrant database allows us to have a chatbot that answer querys over information
    provided from external sources and static information.

## Conclusions

 With this we completed our Chatbot, it can answer question over documents that we uploaded in our Qdrant database, we can ask specific questions based on the user information

    In this project we are using:
* Qdrant database as vector database
* Langchain to manage our chatbot and connection with Qdrant and OpenAI
* OpenAI as LLM
* HuggingFace model to transform our documents into vectors

    With this tools we can answer question based on documents we uploaded before, as well 
    we can manage our chatbot with Langchain

    In next steps we can make our chatbot more complex by adding an interface using Next.js

We hope you can make your chatbot even better with this steps and start a new 
journey in the AI World!

## Acknowledgment
This project was constructed in adherence to the best practices outlined in Robert Martin's book, "Clean Code," making it efficient, maintainable, and easily understood by other programmers.