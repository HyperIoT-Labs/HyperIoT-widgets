import { WidgetComponent } from "./widget.component";


export abstract class WidgetMultiValueComponent extends WidgetComponent {
    private values:Object[] = [];
    private refreshingValue: boolean = false;
    private refreshHandler;

    protected push(newValue:Object){
        this.values.push(newValue)
    }

    protected pop() : Object[]{
        return this.values.splice(0,this.values.length);
    }

    protected resetValue(){
        this.values = [];
    }

   protected startRefreshTask(refreshInterval){
    let self = this;
    this.refreshHandler = setInterval(function(){
        if(!self.refreshingValue){
          self.refreshingValue = true;
          self.renderData();
          //avoind multiple refresh if one is already running
          self.refreshingValue = false;
        }
    },refreshInterval);
  }

  protected stopRefreshTask(){
      clearInterval(this.refreshHandler);
  }

  protected abstract renderData();
}
