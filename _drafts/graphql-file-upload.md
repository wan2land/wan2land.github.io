

```javascript
import gql from "graphql-tag"
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: process.env.API_URL + '/graphql',
    fetch(url, options = {}) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(options.method || 'get', url)
        for (const [key, value] of Object.entries(options.headers || {})) {
          xhr.setRequestHeader(key, value)
        }
        xhr.onload = (e) => resolve({
          ok: true,
          text: () => Promise.resolve(e.target.responseText),
          json: () => Promise.resolve(JSON.parse(e.target.responseText))
        })
        xhr.onerror = reject
        if (xhr.upload && options.onProgress) {
          xhr.upload.onprogress = e => options.onProgress(e)
        }
        xhr.send(options.body)
      })
    },
  }),
})
```

```javascript
const { data } = await this.apolloUploadClient.mutate({      
  mutation: gql`mutation($file: Upload!) {
    attachment: uploadDatableAttachment(file: $file, public: false) {
      id
      url
    }
  }`,
  variables: {
    file: files[0],
  },
  context: {
    fetchOptions: {
      onProgress(e) {
        attachment.progress = e.loaded / e.total
      },
    }
  },
})
```
