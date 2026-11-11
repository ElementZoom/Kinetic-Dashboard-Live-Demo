import sys, os, subprocess, glob, shutil, numpy as np
from PIL import Image, ImageDraw
RL='/tmp/claude-0/-home-claude/ab23074c-f1a5-54cc-96a7-ae43e03c6b32/scratchpad/rl/'
SS=3
def rr(size, rad, inset=0):
    w,h=size; m=Image.new('L',(w*SS,h*SS),0); d=ImageDraw.Draw(m)
    d.rounded_rectangle([inset*SS,inset*SS,(w-inset)*SS-1,(h-inset)*SS-1], radius=rad*SS, fill=255)
    return m.resize((w,h),Image.LANCZOS)
def grad(w,h):
    stops=[(0,(0xD5,0xDB,0xE5)),(.28,(0x7C,0x86,0x96)),(.52,(0xC3,0xCA,0xD6)),(.78,(0x6A,0x74,0x84)),(1,(0xB9,0xC1,0xCE))]
    a=np.deg2rad(135); L=abs(w*np.sin(a))+abs(h*np.cos(a))
    y,x=np.mgrid[0:h,0:w]; t=((x-w/2)*np.sin(a)-(y-h/2)*np.cos(a))/L+.5
    out=np.zeros((h,w,3))
    for c in range(3): out[...,c]=np.interp(t,[s[0] for s in stops],[s[1][c] for s in stops])
    return Image.fromarray(out.astype('uint8'))
def phone(W, name_mp4, out):
    u=W/340; H=round(W*1168/540); pad=3*u; bd=7*u
    base=Image.new('RGBA',(W,H),(0,0,0,0))
    outer=rr((W,H),40*u); g=grad(W,H).convert('RGBA'); base.paste(g,(0,0),outer)
    sx=round(pad+bd); sw=W-2*sx; sh=H-2*sx
    # black border
    blk=Image.new('RGBA',(W,H),(5,7,12,255)); bm=Image.new('L',(W,H),0); bm.paste(rr((W-2*round(pad),H-2*round(pad)),37*u),(round(pad),round(pad)))
    base.paste(blk,(0,0),bm)
    scr=rr((sw,sh),30*u); 
    # punch hole
    def hole(img):
        d=ImageDraw.Draw(img,'RGBA'); r=5.5*u; cy=15*u+r; cx=W/2
        d.ellipse([cx-r-1.5*u,cy-r-1.5*u,cx+r+1.5*u,cy+r+1.5*u],fill=(0x15,0x1B,0x27,255)); d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(0,0,0,255))
    return base,(sx,sx,sw,sh),scr,hole
def tablet(W,H,sw,sh,u,pad,ring):
    base=Image.new('RGBA',(W,H),(0,0,0,0))
    ro=rr((W,H),30*u+pad); base.paste(Image.new('RGBA',(W,H),(0x2B,0x34,0x48,255)),(0,0),ro)
    bm=Image.new('L',(W,H),0); bm.paste(rr((W-2*ring,H-2*ring),30*u),(ring,ring))
    base.paste(Image.new('RGBA',(W,H),(0x0B,0x0F,0x1A,255)),(0,0),bm)
    sx=ring+pad; scr=rr((sw,sh),19*u)
    return base,(sx,sx,sw,sh),scr
def run(kind, mp4, out, W=None):
    tmp='/tmp/art_frames_'+os.path.basename(out); shutil.rmtree(tmp,ignore_errors=True); os.makedirs(tmp)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',mp4,'-vf','fps=15',tmp+'/%05d.png'],check=True)
    fr=sorted(glob.glob(tmp+'/*.png'))
    if kind=='phone':
        base,(sx,sy,sw,sh),scr,hole=phone(W,mp4,out)
    else:
        sw,sh=(960,600) if kind=='tl' else (600,960); u=2; pad=22; ring=4
        Wt,Ht=sw+2*(pad+ring),sh+2*(pad+ring); base,(sx,sy,sw,sh),scr=tablet(Wt,Ht,sw,sh,u,pad,ring); hole=None
    imgs=[]
    for f in fr:
        v=Image.open(f).convert('RGB'); r=max(sw/v.width,sh/v.height); nv=v.resize((round(v.width*r),round(v.height*r)),Image.LANCZOS)
        l=(nv.width-sw)//2; t=(nv.height-sh)//2; nv=nv.crop((l,t,l+sw,t+sh))
        im=base.copy(); im.paste(nv.convert('RGBA'),(sx,sy),scr)
        if hole: hole(im)
        imgs.append(im)
    imgs[0].save(out,save_all=True,append_images=imgs[1:],duration=1000//15,loop=0,quality=80,method=4,lossless=False,allow_mixed=False)
    print(out,len(imgs),imgs[0].size,os.path.getsize(out)//1024,'KB')
if __name__=='__main__':
    kind,mp4,out=sys.argv[1:4]; run(kind,mp4,out,584 if kind=='phone' else None)
