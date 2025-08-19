import React, { useState } from 'react'
import data from './curriculum.json'

function percentToStars(pct){
  if(pct >= 80) return 3
  if(pct >= 60) return 2
  if(pct > 0) return 1
  return 0
}

export default function App(){
  const [route,setRoute] = useState('levels') // levels | map | unit | gen-img | gen-video
  const [unitId,setUnitId] = useState(null)
  const [progress,setProgress] = useState({}) // unitId -> stars
  const beginner = data.levels.find(l=>l.id==='beginner')
  const units = beginner.units

  const canGenImage = (progress['prompting']||0) >= 2
  const canGenVideo = (progress['animation']||0) >= 2

  return <div className='container'>
    <header className='row' style={{justifyContent:'space-between', marginBottom:12}}>
      <div className='row'><b>(Название позже)</b><span className='badge'>⭐ {Object.values(progress).reduce((a,b)=>a+b,0)}</span></div>
      <div className='row'>
        <button className={canGenImage?'btn':'btn lock'} onClick={()=>{ if(canGenImage) setRoute('gen-img')}}>{canGenImage?'Сгенерировать картинку':'Скоро доступно 🔒'}</button>
        <button className={canGenVideo?'btn':'btn lock'} onClick={()=>{ if(canGenVideo) setRoute('gen-video')}}>{canGenVideo?'Сгенерировать видео':'Скоро доступно 🔒'}</button>
      </div>
    </header>

    {route === 'levels' && <Levels onPick={()=> setRoute('map')} />}
    {route === 'map' && <Map units={units} progress={progress} onOpen={(id)=>{ setUnitId(id); setRoute('unit') }} onBack={()=>setRoute('levels')} />}
    {route === 'unit' && <UnitView unit={units.find(u=>u.id===unitId)} onExit={()=>setRoute('map')} onFinish={(pct)=>{
      const stars = percentToStars(pct)
      setProgress(p=>({...p,[unitId]:Math.max(stars, p[unitId]||0)}))
      setRoute('map')
    }} />}
    {route === 'gen-img' && <Generator type='image' onBack={()=>setRoute('map')} />}
    {route === 'gen-video' && <Generator type='video' onBack={()=>setRoute('map')} />}
  </div>
}

function Levels({onPick}){
  const levels = [
    {id:'beginner', title:'Новичок', locked:false},
    {id:'intermediate', title:'Средний', locked:true},
    {id:'advanced', title:'Продвинутый', locked:true},
  ]
  return <div>
    <h2>Выбери уровень</h2>
    <p className='subtitle'>Это обучающий проект, который погрузит тебя в мир нейросетей — легко и играючи. По 15–20 минут в день, и за месяц ты освоишь основы на практике.</p>
    <div className='grid g-3'>
      {levels.map(l=>(
        <div key={l.id} className='card'>
          <div className='card-body'>
            <h3>{l.title}</h3>
            <p className='subtitle'>{l.locked?'Откроется позже':'начнём с азов'}</p>
            <button className={l.locked?'btn lock':'btn'} onClick={()=>!l.locked && onPick(l.id)}>{l.locked?'🔒':'Поехали'}</button>
          </div>
        </div>
      ))}
    </div>
  </div>
}

function Map({units, progress, onOpen, onBack}){
  return <div>
    <h2>Карта: Новичок</h2>
    <p className='subtitle'>Проходи юниты по порядку — зарабатывай ⭐</p>
    <div className='grid g-3'>
      {units.map(u=>(
        <div key={u.id} className='card'>
          <div className='card-body'>
            <h3>{u.title}</h3>
            <div className='subtitle'>
              {u.objectives?.map((o,i)=>(<span key={i} className='tag'>{o}</span>))}
            </div>
            <div className='row' style={{justifyContent:'space-between'}}>
              <span className='badge'>⭐ {progress[u.id]||0}/3</span>
              <button className='btn' onClick={()=>onOpen(u.id)}>Открыть</button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className='row' style={{marginTop:12}}>
      <button className='btn ghost' onClick={onBack}>Назад</button>
    </div>
  </div>
}

function UnitView({unit, onExit, onFinish}){
  const [step,setStep] = useState('intro') // intro | quiz
  const [i,setI] = useState(0)
  const [correct,setCorrect] = useState(0)
  const tasks = unit.questions||[]
  const pct = tasks.length? Math.round(100*correct/tasks.length):0

  if(step==='intro'){
    return <div className='card'>
      <div className='card-body'>
        <h3>{unit.title}</h3>
        <p className='subtitle'>{unit.intro}</p>
        <div className='row' style={{justifyContent:'space-between'}}>
          <button className='btn ghost' onClick={onExit}>Назад</button>
          <button className='btn' onClick={()=>setStep('quiz')}>Начать задание</button>
        </div>
      </div>
    </div>
  }

  const t = tasks[i]
  const last = i>=tasks.length
  if(last){
    return <div className='card'>
      <div className='card-body center'>
        <h3>Юнит пройден!</h3>
        <p className='subtitle'>Правильных ответов: {correct} из {tasks.length} ({pct}%)</p>
        <p className='subtitle'>Звёзды: {pct>=80? '★★★' : pct>=60? '★★' : pct>0? '★' : '0'}</p>
        <button className='btn' onClick={()=>onFinish(pct)}>Вернуться на карту</button>
        {pct<60 && <p className='subtitle' style={{marginTop:8}}>Не дотянули до 2⭐. Давай попробуем ещё раз – перечитай вступление и пройди задание снова.</p>}
      </div>
    </div>
  }

  return <div className='card'>
    <div className='card-body'>
      <div className='row' style={{justifyContent:'space-between'}}>
        <button className='btn ghost' onClick={()=>{ if(window.confirm('Выйти из юнита?')) onExit() }}>Назад</button>
        <span className='badge'>Шаг {i+1}/{tasks.length}</span>
      </div>
      <div className='q'>
        <b>{t.q}</b>
        {t.type==='choice' && <Choice t={t} onNext={(ok)=>{ if(ok) setCorrect(v=>v+1); setI(i+1) }} />}
        {t.type==='input' && <InputQ t={t} onNext={(ok)=>{ if(ok) setCorrect(v=>v+1); setI(i+1) }} />}
      </div>
    </div>
  </div>
}

function Choice({t,onNext}){
  const [state,setState]=useState(null)
  return <div>
    <div className='choices'>
      {t.options.map((opt,idx)=>{
        const cls = state===null ? '' : (idx===t.answer ? 'correct' : (state==='bad' && idx!==t.answer?'wrong':''))
        return <button key={idx} className={cls} onClick={()=>{
          const ok = idx===t.answer; setState(ok?'ok':'bad')
          setTimeout(()=>onNext(ok), 600)
        }}>{opt}</button>
      })}
    </div>
  </div>
}

function InputQ({t,onNext}){
  const [val,setVal] = useState('')
  return <div style={{marginTop:12}}>
    <input placeholder='Напиши короткий ответ...' value={val} onChange={e=>setVal(e.target.value)} />
    <div className='row' style={{justifyContent:'flex-end', marginTop:12}}>
      <button className='btn' onClick={()=>{
        const ok = (val||'').trim().length >= (t.check_min_len || 5)
        onNext(ok)
      }}>Проверить</button>
    </div>
  </div>
}

function Generator({type, onBack}){
  return <div className='card'>
    <div className='card-body center'>
      <h3>{type==='image'?'Генерация картинок':'Генерация видео'}</h3>
      <p className='subtitle'>Скоро появится реальная генерация. Для MVP — заглушка.</p>
      <div className='tag'>Скоро доступно</div>
      <div className='row' style={{justifyContent:'center', marginTop:12}}>
        <button className='btn ghost' onClick={onBack}>Назад</button>
      </div>
    </div>
  </div>
}
