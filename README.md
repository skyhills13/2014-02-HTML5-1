## 1반은 아래와 같이 프로젝트를 진행합니다.


### 1. fork하기
(https://github.com/NHNNEXT/2014-02-HTML5-1/)

### 2. fork한 프로젝트 클론
```
git clone https://github.com/{본인_아이디}/2014-02-HTML5-1
ex) git clone https://github.com/mixed/2014-02-HTML5-1
```

### 3. 프로젝트로 이동
```
cd 2014-02-HTML5-1
```

### 4. 교수 저장소 등록
```
git remote add upstream https://github.com/NHNNEXT/2014-02-HTML5-1
```

### 3. 본인에 아이디/주차에 맞는 브랜치로 checkout
```
git branch -a//자신의 아이디/주차 브랜치를 확인

git checkout -b 주차_로컬_브랜치명 원격_브랜치명
ex) git checkout -b 1week remotes/origin/mixed/1week
```

### 4. 개발 시작

### 5. 커밋
```
git status //확인
git rm 파일명 //삭제된 파일
git add 파일명(or * 모두) // 추가/변경 파일
git commit -m "메세지" // 커밋
```

### 5. 본인 원격 저장소에 올리기
```
git push origin 주차_로컬_브랜치명:원격_브랜치명
ex) git push origin 1week:mixed/1week
```

### 6. 교수한데 pull request
```
git push upstream 로컬_브랜치명:원격_브랜치명
ex) git push upstream 1week:mixed/1week
```

### 7. 교수가 ok하면 다음 주차 브랜치를 만들어줌
```
ex) mixed/2weeks
```

### 8. 원본 저장소와 싱크
```
git fetch upstream
git checkout master
git rebase upstream/master
```

### 9. 3번부터 다시 시작.
